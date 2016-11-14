// clang-format off
import {async, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {BaseRequestOptions, Http, HttpModule, Request, RequestMethod, Response, ResponseOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {Keepalive} from './keepalive';

describe('keepalive/Keepalive', () => {

  beforeEach(
      () => {
        TestBed.configureTestingModule({imports: [HttpModule],
          providers: [BaseRequestOptions, MockBackend, Keepalive, {deps: [MockBackend, BaseRequestOptions],
              provide: Http,
              useFactory:
                  (backend, defaultOptions) => { return new Http(backend, defaultOptions); }
              }]});
      });

  let instance: Keepalive;

  beforeEach(inject([Keepalive], keepalive => { instance = keepalive; }));

  describe('runtime config', () => {
    it('request() should set and return a Request', () => {
      let expected = new Request({method: RequestMethod.Get, url: 'http://test.com'});

      let actual = instance.request(expected);

      expect(actual).toEqual(expected);
    });

    it('request() should set and return a Request from a string URL', () => {
      let expected = 'http://test.com/2';
      let actual = instance.request(expected);

      expect(actual.method).toEqual(RequestMethod.Get);
      expect(actual.url).toEqual(actual.url);
    });

    it('request() with null URL should set request to null', () => {
      let actual = instance.request(null);

      expect(actual).toBeNull();
      expect(instance.request()).toBeNull();
    });

    it('request() with no params should return current value', () => {
      let expected: string = instance.request('https://test.com/3').url;

      expect(instance.request().url).toEqual(expected);
    });

    it('interval() should set and return a numeric value (representing seconds) greater than 0',
       () => {
         let expected = 10;
         let actual = instance.interval(expected);

         expect(actual).toEqual(expected);
       });

    it('interval() with no params should return current value', () => {
      let expected = 10;
      instance.interval(expected);

      let actual = instance.interval();

      expect(actual).toEqual(expected);
    });

    it('interval() should throw if the value is less than or equal to zero', () => {
      expect(() => {
        instance.interval(0);
      }).toThrow(new Error('Interval value must be greater than zero.'));

      expect(() => {
        instance.interval(-1);
      }).toThrow(new Error('Interval value must be greater than zero.'));
    });
  });

  describe('without using HTTP request', () => {
    beforeEach(() => { instance.request(null); });

    it('ping() should emit onPing event', () => {
      spyOn(instance.onPing, 'emit').and.callThrough();

      instance.ping();
      expect(instance.onPing.emit).toHaveBeenCalled();
    });
  });

  describe('using an HTTP request', () => {

    let request = new Request({method: RequestMethod.Get, url: 'https://test.com'});
    let backend: MockBackend;

    beforeEach(inject([Keepalive, MockBackend], (keepalive, mockBackend) => {
      backend = mockBackend;
      instance = keepalive;
      instance.request(request);
    }));

    afterEach(() => {
      // TODO: should be throwing if no expected requests are made
      backend.resolveAllConnections();
      backend.verifyNoPendingRequests();
    });

    it('ping() should fire request and emit onPingResponse event', async(() => {
      backend.connections.subscribe(connection => {
          expect(connection.request.url).toBe(request.url);

          connection.mockRespond(new ResponseOptions({status: 200}));
        });

      instance.onPingResponse.subscribe((response: Response) => {
          expect(response.status).toBe(200);
        });

      instance.ping();
    }));
  });

  describe('on an interval', () => {
    beforeEach(() => {
      instance.interval(5);
      spyOn(instance, 'ping').and.callThrough();
    });

    it('start() should schedule and ping at the specified interval', <any>fakeAsync((): void => {
         instance.start();

         tick(1000);
         expect(instance.ping).not.toHaveBeenCalled();

         tick(4000);
         expect(instance.ping).toHaveBeenCalledTimes(1);

         tick(5000);
         expect(instance.ping).toHaveBeenCalledTimes(2);

         // must call stop to clear intervals, otherwise fake_async will
         // throw "1 periodic timer(s) still in the queue."
         instance.stop();
       }));

    it('stop() should cease pinging', <any>fakeAsync((): void => {
         instance.start();
         instance.stop();

         tick(5000);
         expect(instance.ping).not.toHaveBeenCalled();
       }));

    it('start() after calling start() cancels the previous interval', <any>fakeAsync((): void => {
         instance.start();
         instance.interval(10);
         instance.start();

         tick(5000);
         expect(instance.ping).not.toHaveBeenCalled();

         tick(5000);
         expect(instance.ping).toHaveBeenCalledTimes(1);

         instance.stop();
       }));

    it('ngOnDestroy() invokes stop()', <any>fakeAsync((): void => {
         spyOn(instance, 'stop').and.callThrough();

         instance.start();

         instance.ngOnDestroy();

         expect(instance.stop).toHaveBeenCalled();
       }));

    it('isRunning() should return true after start() and false after stop()', () => {
      expect(instance.isRunning()).toBe(false);
      instance.start();
      expect(instance.isRunning()).toBe(true);
      instance.stop();
      expect(instance.isRunning()).toBe(false);
    });
  });
});
// clang-format on

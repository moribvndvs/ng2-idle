import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { HttpRequest, HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Keepalive } from './keepalive';

describe('keepalive/Keepalive', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
      providers: [Keepalive,provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
  });

  let instance: Keepalive;
  let httpMock: HttpTestingController;

  beforeEach(inject(
    [Keepalive, HttpTestingController],
    (keepalive, httpTestingController) => {
      instance = keepalive;
      httpMock = httpTestingController;
    }
  ));

  describe('runtime config', () => {
    it('request() should set and return a Request', () => {
      const expected = new HttpRequest('GET', 'http://test.com');

      const actual = instance.request(expected);

      expect(actual).toEqual(expected);
    });

    it('request() should set and return a Request from a string URL', () => {
      const expected = 'http://test.com/2';
      const actual = instance.request(expected);

      expect(actual.method).toEqual('GET');
      expect(actual.url).toEqual(actual.url);
    });

    it('request() with null URL should set request to null', () => {
      const actual = instance.request(null);

      expect(actual).toBeNull();
      expect(instance.request()).toBeNull();
    });

    it('request() with no params should return current value', () => {
      const expected: string = instance.request('https://test.com/3').url;

      expect(instance.request().url).toEqual(expected);
    });

    it('interval() should set and return a numeric value (representing seconds) greater than 0', () => {
      const expected = 10;
      const actual = instance.interval(expected);

      expect(actual).toEqual(expected);
    });

    it('interval() with no params should return current value', () => {
      const expected = 10;
      instance.interval(expected);

      const actual = instance.interval();

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
    beforeEach(() => {
      instance.request(null);
    });

    it('ping() should emit onPing event', () => {
      spyOn(instance.onPing, 'emit').and.callThrough();

      instance.ping();
      expect(instance.onPing.emit).toHaveBeenCalled();
    });
  });

  describe('using an HTTP request', () => {
    const request = new HttpRequest('GET', 'https://test.com');

    beforeEach(() => {
      instance = TestBed.inject<Keepalive>(Keepalive);
      instance.request(request);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('ping() should fire request and emit onPingResponse event', () => {
      let actualResponse: HttpResponse<{}>;

      instance.onPingResponse.subscribe(
        (response: HttpResponse<{}>) => {
          actualResponse = response;
        },
        (error: HttpResponse<{}>) => {
          actualResponse = error;
        }
      );

      instance.ping();

      httpMock
        .expectOne(request.url)
        .flush(null, { status: 200, statusText: 'OK' });
      expect(actualResponse.status).toBe(200);
    });
  });

  describe('using an HTTP request that results in error', () => {
    const request = new HttpRequest('GET', 'https://test.com/404');

    beforeEach(() => {
      instance = TestBed.inject<Keepalive>(Keepalive);
      instance.request(request);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('ping() should fire request and emit onPingResponse event', () => {
      let actualResponse: HttpResponse<{}>;

      instance.onPingResponse.subscribe(
        (response: HttpResponse<{}>) => {
          actualResponse = response;
        },
        (error: HttpResponse<{}>) => {
          actualResponse = error;
        }
      );

      instance.ping();

      httpMock
        .expectOne(request.url)
        .flush(null, { status: 404, statusText: 'Error' });
      expect(actualResponse.status).toBe(404);
    });
  });

  describe('on an interval', () => {
    beforeEach(() => {
      instance.interval(5);
      spyOn(instance, 'ping').and.callThrough();
    });

    it('start() should schedule and ping at the specified interval', fakeAsync((): void => {
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

    it('stop() should cease pinging', fakeAsync((): void => {
      instance.start();
      instance.stop();

      tick(5000);
      expect(instance.ping).not.toHaveBeenCalled();
    }));

    it('start() after calling start() cancels the previous interval', fakeAsync((): void => {
      instance.start();
      instance.interval(10);
      instance.start();

      tick(5000);
      expect(instance.ping).not.toHaveBeenCalled();

      tick(5000);
      expect(instance.ping).toHaveBeenCalledTimes(1);

      instance.stop();
    }));

    it('ngOnDestroy() invokes stop()', fakeAsync((): void => {
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

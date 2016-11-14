import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {Http, Request, RequestMethod, Response} from '@angular/http';
import {KeepaliveSvc} from '@ng-idle/core';


/**
 * An example of an injectable service.
 */
@Injectable()
export class Keepalive extends KeepaliveSvc implements OnDestroy {
  private pingRequest: Request;
  private pingInterval: number = 10 * 60;
  private pingHandle: any;

  /*
   * An event emitted when the service is pinging.
   */
  public onPing: EventEmitter<any> = new EventEmitter;

  /*
   * An event emitted when the service has pinged an HTTP endpoint and received a response.
   */
  public onPingResponse: EventEmitter<Response> = new EventEmitter<Response>();

  /*
   * Initializes a new instance of Keepalive
   * @param http - The HTTP service.
   */
  constructor(private http: Http) {
    super();
  }

  /*
   * Sets the string or Request that should be used when pinging.
   * @param url - The URL or Request object to use when pinging.
   * @return The current Request used when pinging.
   */
  request(url?: string|Request): Request {
    if (typeof url === 'string') {
      this.pingRequest = new Request({method: RequestMethod.Get, url: url});
    } else if (url instanceof Request) {
      this.pingRequest = url;
    } else if (url === null) {
      this.pingRequest = null;
    }

    return this.pingRequest;
  }

  /*
   * Sets the interval (in seconds) at which the ping operation will occur when start() is called.
   * @param seconds - The ping interval in seconds.
   * @return The current interval value.
   */
  interval(seconds?: number): number {
    if (!isNaN(seconds) && seconds > 0) {
      this.pingInterval = seconds;
    } else if (!isNaN(seconds) && seconds <= 0) {
      throw new Error('Interval value must be greater than zero.');
    }

    return this.pingInterval;
  }

  /*
   * Immediately performs the ping operation. If a request has been set, an HTTP
   * request will be made and the response will be emitted via the
   * onPingResponse event.
   */
  ping(): void {
    this.onPing.emit(null);
    if (this.pingRequest) {
      this.http.request(this.pingRequest).subscribe((response: Response) => {
        this.onPingResponse.emit(response);
      });
    }
  }

  /*
   * Starts pinging on an interval.
   */
  start(): void {
    this.stop();

    this.pingHandle = setInterval(() => {
      this.ping();
    }, this.pingInterval * 1000);
  }

  /*
   * Stops pinging on an interval.
   */
  stop(): void {
    if (this.pingHandle) {
      clearInterval(this.pingHandle);
      this.pingHandle = null;
    }
  }

  /*
   * Performs any cleanup tasks when Angular destroys the instance.
   */
  ngOnDestroy(): void {
    this.stop();
  }

  /*
   * Returns whether or not the service will ping automatically at the specified interval.
   * @return True if the service will ping at the specified interval; otherwise, false.
   */
  isRunning(): boolean {
    return !!this.pingHandle;
  }
}

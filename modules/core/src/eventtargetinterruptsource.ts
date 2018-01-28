import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { InterruptArgs } from './interruptargs';
import { InterruptSource } from './interruptsource';

/**
 * Options for EventTargetInterruptSource
 */
export interface EventTargetInterruptOptions {
  /**
   * The number of milliseconds to throttle the events coming from the target.
   */
  throttleDelay?: number;

  /**
   * Whether or not to use passive event listeners.
   * Note: you need to detect if the browser supports passive listeners, and only set this to true if it does.
   */
  passive?: boolean;
}

const defaultThrottleDelay = 500;

/*
 * An interrupt source on an EventTarget object, such as a Window or HTMLElement.
 */
export class EventTargetInterruptSource extends InterruptSource {
  private eventSrc: Array<Observable<any>> = new Array;
  private eventSubscription: Array<Subscription> = new Array;
  protected throttleDelay: number;
  protected passive: boolean;

  constructor(protected target: any, protected events: string, options?: number | EventTargetInterruptOptions) {
    super(null, null);

    if (typeof options === 'number') {
      options = { throttleDelay: options, passive: false };
    }

    options = options || { throttleDelay: defaultThrottleDelay, passive: false };

    if (options.throttleDelay === undefined || options.throttleDelay === null) {
      options.throttleDelay = defaultThrottleDelay;
    }

    this.throttleDelay = options.throttleDelay;
    this.passive = !!options.passive;

    let self = this;

    events.split(' ').forEach(function (event) {
      const opts = self.passive ? { passive: true } : null;
      let src = Observable.fromEvent(target, event, opts);

      if (self.throttleDelay > 0) {
        src = src.throttleTime(self.throttleDelay);
      }

      self.eventSrc.push(src);
    });

    let handler = function (innerArgs: any): void {
      if (self.filterEvent(innerArgs)) {
        return;
      }
      let args = new InterruptArgs(this, innerArgs);
      self.onInterrupt.emit(args);
    };

    this.attachFn = () => {
      this.eventSrc.forEach((src: Observable<any>) => {
        self.eventSubscription.push(src.subscribe(handler));
      });
    };

    this.detachFn = () => {
      this.eventSubscription.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
      this.eventSubscription.length = 0;
    };
  }

  /*
   * Checks to see if the event should be filtered. Always returns false unless overriden.
   * @param event - The original event object.
   * @return True if the event should be filtered (don't cause an interrupt); otherwise, false.
   */
  protected filterEvent(event: any): boolean {
    return false;
  }

  /**
   * Returns the current options being used.
   * @return {EventTargetInterruptOptions} The current option values.
   */
  get options(): EventTargetInterruptOptions {
    return { throttleDelay: this.throttleDelay, passive: this.passive };
  }
}

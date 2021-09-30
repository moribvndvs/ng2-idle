import { isPlatformServer } from '@angular/common';
import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';

import { EventTarget } from './eventtarget';
import { InterruptArgs } from './interruptargs';
import { InterruptOptions } from './interruptoptions';
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
  private eventSrc: Observable<any>;
  private eventSubscription: Subscription = new Subscription();
  protected throttleDelay: number;
  protected passive: boolean;

  constructor(
    protected target: EventTarget<any> | (() => EventTarget<any>),
    protected events: string,
    private opts?: number | EventTargetInterruptOptions
  ) {
    super(null, null);

    if (typeof this.opts === 'number') {
      this.opts = { throttleDelay: this.opts, passive: false };
    }

    this.opts = this.opts || {
      passive: false,
      throttleDelay: defaultThrottleDelay
    };

    if (this.opts.throttleDelay === undefined || this.opts.throttleDelay === null) {
      this.opts.throttleDelay = defaultThrottleDelay;
    }

    this.throttleDelay = this.opts.throttleDelay;
    this.passive = !!this.opts.passive;
  }

  initialize(options?: InterruptOptions) {
    if (options?.platformId && isPlatformServer(options.platformId)) {
      return;
    }

    const eventTarget = typeof this.target === 'function' ? this.target() : this.target;
    const opts = this.passive ? { passive: true } : null;
    const fromEvents = this.events
      .split(' ')
      .map(eventName => fromEvent(eventTarget, eventName, opts));
    this.eventSrc = merge(...fromEvents);
    this.eventSrc = this.eventSrc.pipe(
      filter(innerArgs => !this.filterEvent(innerArgs))
    );
    if (this.throttleDelay > 0) {
      this.eventSrc = this.eventSrc.pipe(throttleTime(this.throttleDelay));
    }

    const handler = (innerArgs: any) =>
      this.onInterrupt.emit(new InterruptArgs(this, innerArgs));

    this.attachFn = () =>
      (this.eventSubscription = this.eventSrc.subscribe(handler));

    this.detachFn = () => this.eventSubscription.unsubscribe();
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
   * @return The current option values.
   */
  get options(): EventTargetInterruptOptions {
    return {
      passive: this.passive,
      throttleDelay: this.throttleDelay
    };
  }
}

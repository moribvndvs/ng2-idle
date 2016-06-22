import {Observable, Subscription} from 'rxjs/Rx';

import {InterruptArgs} from './interruptargs';
import {InterruptSource} from './interruptsource';


/*
 * An interrupt source on an EventTarget object, such as a Window or HTMLElement.
 */
export class EventTargetInterruptSource extends InterruptSource {
  private eventSrc: Array<Observable<any>> = new Array;
  private eventSubscription: Array<Subscription> = new Array;

  constructor(protected target, protected events: string, protected throttleDelay = 500) {
    super(null, null);

    let self = this;

    events.split(' ').forEach(function(event) {
      let src = Observable.fromEvent(target, event);

      if (self.throttleDelay > 0) {
        src = src.throttleTime(self.throttleDelay);
      }

      self.eventSrc.push(src);
    });

    let handler = function(innerArgs: any): void {
      if (self.filterEvent(innerArgs)) {
        return;
      }
      let args = new InterruptArgs(this, innerArgs);
      self.onInterrupt.emit(args);
    };

    this.attachFn = () => {
      this.eventSrc.forEach(
          (src: Observable<any>) => { self.eventSubscription.push(src.subscribe(handler)); });
    };

    this.detachFn = () => {
      this.eventSubscription.forEach((sub: Subscription) => { sub.unsubscribe(); });
      this.eventSubscription.length = 0;
    };
  }

  /*
   * Checks to see if the event should be filtered. Always returns false unless overriden.
   * @param event - The original event object.
   * @return True if the event should be filtered (don't cause an interrupt); otherwise, false.
   */
  protected filterEvent(event: any): boolean { return false; }
}

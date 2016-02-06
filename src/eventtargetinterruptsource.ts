import {InterruptSource} from './interruptsource';
import {InterruptArgs} from './interruptargs';
import {Observable, Subscription} from 'rxjs/Rx';

/*
 * An interrupt source on an EventTarget object, such as a Window or HTMLElement.
 */
export class EventTargetInterruptSource extends InterruptSource {
  private eventSrc: Observable<any>;
  private eventSubscription: Subscription<any>;

  constructor(protected target, protected events: string) {
    super(null, null);

    this.eventSrc = Observable.fromEvent(target, this.events);

    let self = this;
    let handler = function(innerArgs: any): void {
      if (self.filterEvent(innerArgs)) {
        return;
      }
      let args = new InterruptArgs(this, innerArgs);
      self.onInterrupt.emit(args);
    };

    this.attachFn = () => { this.eventSubscription = this.eventSrc.subscribe(handler); };

    this.detachFn = () => {
      this.eventSubscription.unsubscribe();
      this.eventSubscription = null;
    };
  }

  /*
   * Checks to see if the event should be filtered. Always returns false unless overriden.
   * @param event - The original event object.
   * @return True if the event should be filtered (don't cause an interrupt); otherwise, false.
   */
  protected filterEvent(event: any): boolean { return false; }
}

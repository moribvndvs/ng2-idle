import { EventEmitter } from '@angular/core';

import { InterruptArgs } from './interruptargs';

/*
 * A base for classes that act as a source for interrupts.
 */
export abstract class InterruptSource {
  isAttached = false;

  public onInterrupt: EventEmitter<InterruptArgs> = new EventEmitter<InterruptArgs>();

  constructor(
    protected attachFn?: (source: InterruptSource) => void,
    protected detachFn?: (source: InterruptSource) => void) { }

  /*
   * Attaches to the specified events on the specified source.
   */
  attach(): void {
    // If the current zone is the 'angular' zone (a.k.a. NgZone) then re-enter this method in its parent zone
    // The parent zone is usually the '<root>' zone but it can also be 'long-stack-trace-zone' in debug mode
    // In tests, the current zone is typically a 'ProxyZone' created by async/fakeAsync (from @angular/core/testing)
    if (Zone.current.get('isAngularZone') === true) {
      Zone.current.parent.run(() => this.attach());
      return;
    }

    if (!this.isAttached && this.attachFn) {
      this.attachFn(this);
    }

    this.isAttached = true;
  }

  /*
   * Detaches from the specified events on the specified source.
   */
  detach(): void {
    if (this.isAttached && this.detachFn) {
      this.detachFn(this);
    }

    this.isAttached = false;
  }
}

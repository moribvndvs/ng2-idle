import {InterruptArgs, InterruptSource} from '@ng-idle/core';


/*
 * A simple InterruptSource for mocking during tests.
 */
export class MockInterruptSource extends InterruptSource {
  constructor(attach?: () => void, detach?: () => void) {
    super(attach, detach);
  }

  /*
   * Simulates the external interrupt, triggering onInterrupt.
   * @param innerArgs - The original event arguments or data, if any.
   */
  trigger(innerArgs?: any): void {
    this.onInterrupt.emit(new InterruptArgs(this, innerArgs));
  }
}

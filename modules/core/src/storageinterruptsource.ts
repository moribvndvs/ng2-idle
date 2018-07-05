import { WindowInterruptSource } from './windowinterruptsource';

/*
 * An interrupt source on the storage event of Window.
 */
export class StorageInterruptSource extends WindowInterruptSource {
  constructor(throttleDelay = 500) {
    super('storage', throttleDelay);
  }

  /*
   * Checks to see if the event should be filtered.
   * @param event - The original event object.
   * @return True if the event should be filtered (don't cause an interrupt); otherwise, false.
   */
  filterEvent(event: StorageEvent): boolean {
    if (event.key && event.key.indexOf('ng2Idle.') >= 0 && event.key.indexOf('.expiry') >= 0) {
      return false;
    }
    return true;
  }
}

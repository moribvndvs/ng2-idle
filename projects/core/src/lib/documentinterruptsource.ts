import {
  EventTargetInterruptOptions,
  EventTargetInterruptSource
} from './eventtargetinterruptsource';

/*
 * An interrupt source that uses events on the document element (html tag).
 */
export class DocumentInterruptSource extends EventTargetInterruptSource {
  constructor(events: string, options?: number | EventTargetInterruptOptions) {
    super(document.documentElement, events, options);
  }

  /*
   * Checks to see if the event should be filtered.
   * @param event - The original event object.
   * @return True if the event should be filtered (don't cause an interrupt); otherwise, false.
   */
  filterEvent(event: any): boolean {
    // some browser bad input hacks
    if (
      event.type === 'mousemove' &&
      // fix for Chrome destop notifications
      ((event.originalEvent &&
        event.originalEvent.movementX === 0 &&
        event.originalEvent.movementY === 0) ||
        // fix for webkit fake mousemove
        ((event.movementX !== void 0 && !event.movementX) || !event.movementY))
    ) {
      return true;
    }

    return false;
  }
}

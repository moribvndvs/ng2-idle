import {EventTargetInterruptOptions, EventTargetInterruptSource} from './eventtargetinterruptsource';

/*
 * An interrupt source on the Window object.
 */
export class WindowInterruptSource extends EventTargetInterruptSource {
  constructor(events: string, options?: number | EventTargetInterruptOptions) {
    if (typeof window !== 'undefined') {
      super(window, events, options);
    }
  }
}

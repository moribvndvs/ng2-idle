import {EventTargetInterruptSource} from './eventtargetinterruptsource';

/*
 * An interrupt source on the Window object.
 */
export class WindowInterruptSource extends EventTargetInterruptSource {
  constructor(events: string, throttleDelay = 500) { super(window, events, throttleDelay); }
}

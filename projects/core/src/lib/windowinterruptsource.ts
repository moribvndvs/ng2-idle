import {
  EventTargetInterruptOptions,
  EventTargetInterruptSource
} from './eventtargetinterruptsource';

/*
 * An interrupt source on the Window object.
 */
export class WindowInterruptSource extends EventTargetInterruptSource {
  constructor(events: string, options?: number | EventTargetInterruptOptions) {
    const target =
      options && (options as EventTargetInterruptOptions).ssr ? null : window;

    super(target, events, options);
  }
}

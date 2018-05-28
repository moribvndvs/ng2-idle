import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {EventTargetInterruptOptions, EventTargetInterruptSource} from './eventtargetinterruptsource';

/*
 * An interrupt source on the Window object.
 */
export class WindowInterruptSource extends EventTargetInterruptSource {
  constructor(events: string, options?: number | EventTargetInterruptOptions, @Inject(PLATFORM_ID) private platformId?: any) {
    super(isPlatformBrowser(platformId) ? window : null, events, options);
  }
}

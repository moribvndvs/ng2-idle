import {provide} from '@angular/core';

import {Idle} from './idle';

import {DocumentInterruptSource} from './documentinterruptsource';
import {IdleExpiry} from './idleexpiry';
import {SimpleExpiry} from './simpleexpiry';

export * from './idle';
export * from './interruptargs';
export * from './interruptsource';
export * from './eventtargetinterruptsource';
export * from './documentinterruptsource';
export * from './windowinterruptsource';
export * from './keepalivesvc';
export * from './idleexpiry';
export * from './simpleexpiry';

export const IDLE_PROVIDERS: any[] =
    [SimpleExpiry, provide(IdleExpiry, {useExisting: SimpleExpiry}), Idle];

export const DEFAULT_INTERRUPTSOURCES: any[] = [new DocumentInterruptSource(
    'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')];

export default {providers: [IDLE_PROVIDERS]}

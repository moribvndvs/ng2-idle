import {Idle} from './idle';

import {DocumentInterruptSource} from './documentinterruptsource';

export * from './idle';
export * from './interruptargs';
export * from './interruptsource';
export * from './eventtargetinterruptsource';
export * from './documentinterruptsource';
export * from './windowinterruptsource';
export * from './keepalivesvc';

export const IDLE_PROVIDERS: any[] = [Idle];
export const DEFAULT_INTERRUPTSOURCES: any[] = [new DocumentInterruptSource(
    'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')];

export default {providers: [IDLE_PROVIDERS]}

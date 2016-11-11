import {DocumentInterruptSource} from './src/documentinterruptsource';

export * from './src/idle';
export * from './src/interruptargs';
export * from './src/interruptsource';
export * from './src/eventtargetinterruptsource';
export * from './src/documentinterruptsource';
export * from './src/windowinterruptsource';
export * from './src/keepalivesvc';
export * from './src/idleexpiry';
export * from './src/simpleexpiry';

export const DEFAULT_INTERRUPTSOURCES: any[] = [new DocumentInterruptSource(
    'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')];

export {Ng2IdleModule} from './src/module';

import { DocumentInterruptSource } from './src/documentinterruptsource';
import { EventTargetInterruptOptions } from './src/eventtargetinterruptsource';
import { StorageInterruptSource } from './src/storageinterruptsource';

export * from './src/idle';
export * from './src/interruptargs';
export * from './src/interruptsource';
export * from './src/eventtargetinterruptsource';
export * from './src/documentinterruptsource';
export * from './src/windowinterruptsource';
export * from './src/storageinterruptsource';
export * from './src/keepalivesvc';
export * from './src/idleexpiry';
export * from './src/simpleexpiry';
export * from './src/localstorage';
export * from './src/localstorageexpiry';

export function createDefaultInterruptSources(options?: EventTargetInterruptOptions) {
  return [new DocumentInterruptSource(
    'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll', options),
  new StorageInterruptSource()];
}

export const DEFAULT_INTERRUPTSOURCES: any[] = createDefaultInterruptSources();

export { NgIdleModule } from './src/module';

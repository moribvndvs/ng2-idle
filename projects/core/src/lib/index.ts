import { DocumentInterruptSource } from './documentinterruptsource';
import { EventTargetInterruptOptions } from './eventtargetinterruptsource';
import { StorageInterruptSource } from './storageinterruptsource';

export * from './idle';
export * from './interruptargs';
export * from './interruptsource';
export * from './eventtargetinterruptsource';
export * from './documentinterruptsource';
export * from './windowinterruptsource';
export * from './storageinterruptsource';
export * from './keepalivesvc';
export * from './idleexpiry';
export * from './simpleexpiry';
export * from './localstorage';
export * from './localstorageexpiry';

export function createDefaultInterruptSources(
  options?: EventTargetInterruptOptions
) {
  return [
    new DocumentInterruptSource(
      'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll',
      options
    ),
    new StorageInterruptSource()
  ];
}

export const DEFAULT_INTERRUPTSOURCES: any[] = createDefaultInterruptSources();

export { NgIdleModule } from './module';

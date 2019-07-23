import { DocumentInterruptSource } from './documentinterruptsource';
import { EventTargetInterruptOptions } from './eventtargetinterruptsource';
import { StorageInterruptSource } from './storageinterruptsource';

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

import { Provider } from '@angular/core';

import { Idle } from './idle';
import { IdleExpiry } from './idleexpiry';
import { LocalStorageExpiry } from './localstorageexpiry';
import { LocalStorage } from './localstorage';

export function provideNgIdle(): Provider[] {
  return [
    LocalStorage,
    LocalStorageExpiry,
    Idle,
    {
      provide: IdleExpiry,
      useExisting: LocalStorageExpiry
    }
  ];
}

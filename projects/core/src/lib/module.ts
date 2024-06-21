import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

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
};

@NgModule({
  providers: [LocalStorage]
})
export class NgIdleModule {
  static forRoot(): ModuleWithProviders<NgIdleModule> {
    return {
      ngModule: NgIdleModule,
      providers: [
        LocalStorageExpiry,
        { provide: IdleExpiry, useExisting: LocalStorageExpiry },
        Idle
      ]
    };
  }
}

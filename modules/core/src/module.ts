import {ModuleWithProviders, NgModule} from '@angular/core';

import {Idle} from './idle';
import {IdleExpiry} from './idleexpiry';
import {LocalStorageExpiry} from './localstorageexpiry';
import {LocalStorage} from './localstorage';

@NgModule({
  providers: [LocalStorage]
})
export class NgIdleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgIdleModule,
      providers: [LocalStorageExpiry, {provide: IdleExpiry, useExisting: LocalStorageExpiry}, Idle]
    };
  }
}

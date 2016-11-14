import {ModuleWithProviders, NgModule} from '@angular/core';

import {Idle} from './idle';
import {IdleExpiry} from './idleexpiry';
import {SimpleExpiry} from './simpleexpiry';

@NgModule()
export class NgIdleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgIdleModule,
      providers: [SimpleExpiry, {provide: IdleExpiry, useExisting: SimpleExpiry}, Idle]
    };
  }
}

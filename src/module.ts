import {ModuleWithProviders, NgModule} from '@angular/core';

import {Idle} from './idle';
import {IdleExpiry} from './idleexpiry';
import {SimpleExpiry} from './simpleexpiry';

@NgModule()
export class Ng2IdleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Ng2IdleModule,
      providers: [SimpleExpiry, {provide: IdleExpiry, useExisting: SimpleExpiry}, Idle]
    };
  }
}

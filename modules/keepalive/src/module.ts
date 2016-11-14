import {ModuleWithProviders, NgModule} from '@angular/core';
import {KeepaliveSvc, NgIdleModule} from '@ng-idle/core';

import {Keepalive} from './keepalive';

@NgModule({imports: [NgIdleModule.forRoot()]})
export class NgIdleKeepaliveModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgIdleKeepaliveModule,
      providers: [Keepalive, {provide: KeepaliveSvc, useExisting: Keepalive}]
    };
  }
}

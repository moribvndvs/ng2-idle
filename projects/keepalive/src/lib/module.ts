import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { KeepaliveSvc, NgIdleModule, provideNgIdle } from '@ng-idle/core';

import { Keepalive } from './keepalive';

export function provideNgIdleKeepalive(): Provider[] {
  return [
    provideNgIdle(),
    Keepalive,
    { provide: KeepaliveSvc, useExisting: Keepalive }
  ];
};

@NgModule({ imports: [NgIdleModule.forRoot()] })
export class NgIdleKeepaliveModule {
  static forRoot(): ModuleWithProviders<NgIdleKeepaliveModule> {
    return {
      ngModule: NgIdleKeepaliveModule,
      providers: [Keepalive, { provide: KeepaliveSvc, useExisting: Keepalive }]
    };
  }
}

import { Provider } from '@angular/core';
import { KeepaliveSvc } from '@ng-idle/core';

import { Keepalive } from './keepalive';

export function provideNgIdleKeepalive(): Provider[] {
  return [Keepalive, { provide: KeepaliveSvc, useExisting: Keepalive }];
};

// @NgModule({ imports: [NgIdleModule.forRoot()] })
// export class NgIdleKeepaliveModule {
//   static forRoot(): ModuleWithProviders<NgIdleKeepaliveModule> {
//     return {
//       ngModule: NgIdleKeepaliveModule,
//       providers: [Keepalive, { provide: KeepaliveSvc, useExisting: Keepalive }]
//     };
//   }
// }

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
};
// export class NgIdleModule {
//   static forRoot(): ModuleWithProviders<NgIdleModule> {
//     return {
//       ngModule: NgIdleModule,
//       providers: [
//         LocalStorage,
//         LocalStorageExpiry,
//         { provide: IdleExpiry, useExisting: LocalStorageExpiry },
//         Idle
//       ]
//     };
//   }
// }

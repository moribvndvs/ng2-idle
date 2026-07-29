import { Provider } from '@angular/core';
import { KeepaliveSvc, provideNgIdle } from '@ng-idle/core';

import { Keepalive } from './keepalive';

export function provideNgIdleKeepalive(): Provider[] {
  return [
    provideNgIdle(),
    Keepalive,
    { provide: KeepaliveSvc, useExisting: Keepalive }
  ];
}

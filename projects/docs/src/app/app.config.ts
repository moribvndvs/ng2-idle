import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http'; // omit if not using keepalive
import { provideNgIdleKeepalive } from '@ng-idle/keepalive';
import { provideHighlightOptions } from 'ngx-highlightjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHighlightOptions({
        fullLibraryLoader: () => import('highlight.js')
    }),
    provideNgIdleKeepalive(),
    provideHttpClient(withFetch())
  ]
};
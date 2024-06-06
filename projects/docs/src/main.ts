import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideHttpClient, withFetch } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, 
  {
    providers: [
      provideRouter(routes),
      provideHighlightOptions({
        fullLibraryLoader: () => import('highlight.js')
      }),
      provideHttpClient(withFetch()),
    ]
  }
).catch(e => console.error(e));

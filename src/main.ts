import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent as App } from './app/app.component';

// GitHub Pages SPA routing: restore path after 404.html redirect
(function() {
  const redirect = sessionStorage['redirect'];
  if (redirect && redirect !== location.href) {
    sessionStorage['redirect'] = '';
    location.replace(redirect);
  }
})();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { KeycloakService } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        realm: 'onlineshop-dev',
        url: 'http://localhost:8180',
        clientId: 'onlineshop-angular-client'
      },
      initOptions: {
        pkceMethod: 'S256',
        redirectUri:'http://localhost:4200/products',
        onLoad: 'check-sso',
        //silentCheckSsoRedirectUri:
        //  window.location.origin + '/assets/silent-check-sso.html'
      }, loadUserProfileAtStartUp: false
    });
}


export const appConfig: ApplicationConfig = {
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  },
    KeycloakService,
    provideHttpClient(withFetch(), withInterceptorsFromDi()), provideRouter(routes), provideClientHydration()]
};

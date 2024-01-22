import {APP_INITIALIZER, ApplicationConfig, Provider} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {KeycloakBearerInterceptor, KeycloakService} from "keycloak-angular";

function initializeKeycloak(keycloak: KeycloakService) {
 return () =>
   keycloak.init({
     // Configuration details for Keycloak
     config: {
        realm: 'onlineshop-dev',
        url: 'http://localhost:8180',
        clientId: 'onlineshop-angular-client'
      },
     // Options for Keycloak initialization
     initOptions: {
       pkceMethod: 'S256',
       redirectUri:'http://localhost:4200/products',
       onLoad: 'check-sso'//,  Action to take on load
     //  silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`
        // window.location.origin + '/assets/silent-check-sso.html' // URI for silent SSO checks
     },
     // Enables Bearer interceptor
     enableBearerInterceptor: true,
     // Prefix for the Bearer token
     bearerPrefix: 'Bearer',
     // URLs excluded from Bearer token addition (empty by default)
     bearerExcludedUrls: ['/assets']
   });
}

// Provider for Keycloak Bearer Interceptor
const KeycloakBearerInterceptorProvider: Provider = {
 provide: HTTP_INTERCEPTORS,
 useClass: KeycloakBearerInterceptor,
 multi: true
};

// Provider for Keycloak Initialization
const KeycloakInitializerProvider: Provider = {
 provide: APP_INITIALIZER,
 useFactory: initializeKeycloak,
 multi: true,
 deps: [KeycloakService]
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    KeycloakInitializerProvider, // Initializes Keycloak
   KeycloakBearerInterceptorProvider, // Provides Keycloak Bearer Interceptor
   KeycloakService, // Service for Keycloak
     provideRouter(routes), provideClientHydration()]
};

//import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
//import { isPlatformBrowser } from "@angular/common";
//import { KeycloakService } from "keycloak-angular";

////declare var require: any;

////const Keycloak = typeof window !== 'undefined' ? require('keycloak-angular') : null;

//@Injectable({
//  providedIn: 'root'
//})

//export class SsrService {
//  private readonly browser: boolean;
//  private readonly keycloakInstance: KeycloakService | undefined;

//  constructor(@Inject(PLATFORM_ID) platformId: Object, private injector: Injector) {
//    this.browser = isPlatformBrowser(platformId);
//    if (this.browser) {
//      this.keycloakInstance = this.injector.get(KeycloakService);
//    }
//  }

//  isBrowser(): boolean{
//    return this.browser;
//  }

//  get keycloak(): KeycloakService | undefined{
//    return this.keycloakInstance;
//  }
//}
//export class KeycloakService {
//  public keycloakAuth: any;

//  constructor() { }

//  init() {
//    if (Keycloak === null) return null;
//    return new Promise<void>((resolve, reject) => {
//      const config = {
//        url: 'http://localhost:8080/auth',
//        realm: 'frontend',
//        clientId: 'angular-keycloak-test',
//      };
//      this.keycloakAuth = new Keycloak(config);
//      this.keycloakAuth
//        .init({
//          checkLoginIframe: false,
//          onLoad: 'login-required',
//          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
//        })
//        .success(() => {
//          console.log('success');

//          resolve();
//        })
//        .error(() => {
//          console.log('error');

//          reject();
//        });
//    });
//  }

//  getToken(): string {
//    return this.keycloakAuth.token;
//  }

//  getRefreshToken(): string {
//    return this.keycloakAuth.refreshToken;
//  }
//}

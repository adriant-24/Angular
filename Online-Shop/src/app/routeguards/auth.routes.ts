import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { LocalstorageService } from '../storage/local-storage';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User } from '../common/user';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})

export class AuthKeycloakGuard extends KeycloakAuthGuard {

  user: User = new User();
  userProfile: KeycloakProfile | null = null;

  constructor(protected override readonly router: Router,
    protected readonly keycloak: KeycloakService) {
      super(router, keycloak)
    }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url
      });
    }
    else {
      this.userProfile = await this.keycloak.loadUserProfile();
      // this.user.userId = this.userProfile.id;
      this.user.userName = this.userProfile.username || '';
      this.user.userInfo.firstName = this.userProfile.firstName || '';
      this.user.userInfo.lastName = this.userProfile.lastName || '';
      this.user.userInfo.email = this.userProfile.email || '';

      this.user.authStatus = 'AUTH';
      window.sessionStorage.setItem('userdetails', JSON.stringify(this.user));
    }

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
  }

}

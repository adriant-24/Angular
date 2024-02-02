import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LocalstorageService } from '../../storage/local-storage';
import { User } from '../../common/user';

import { KeycloakProfile } from 'keycloak-js';
import { CartStatusComponent } from '../cart/cart-status/cart-status.component';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartStatusComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isLoggedIn: boolean = false;
  userProfile: KeycloakProfile | null = null;
  user = new User();
  constructor(private route: ActivatedRoute,
    private localStorage: LocalstorageService,
    private keycloakService: KeycloakService,
    private userService: UserService) { }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();
     // this.user.userId = this.userProfile.id;
      if (this.userProfile) {
        this.user = this.userService.setUserDetails(this.userProfile);
        this.userService.getUserAddresses();
      }   
    }
  }

  public login() {
    this.keycloakService.login();
  }

  public logout() {
    let redirectUrl:string = "http://localhost:4200/products";
    this.keycloakService.logout(redirectUrl);
    window.sessionStorage.setItem('userdetails', '');
  }
}

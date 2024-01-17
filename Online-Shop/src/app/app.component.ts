import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { HttpClientModule} from '@angular/common/http'
import { ProductListComponent } from './components/product/product-list/product-list.component';

import { ProductSearchComponent } from './components/product/product-search/product-search.component';
import { ProductDetailsComponent } from './components/product/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { LoginComponent } from './components/login/login.component';
import { BehaviorSubject } from 'rxjs';
import { LogoutComponent } from './components/logout/logout.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule,
    RouterLink, RouterLinkActive, ReactiveFormsModule,
    ProductListComponent, ProductSearchComponent, SideBarComponent,
    ProductDetailsComponent, HeaderComponent, CartDetailsComponent,
    CheckoutComponent, LoginComponent, LogoutComponent
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
  title = 'Online-Shop';

  static isBrowser = new BehaviorSubject<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private userService: UserService) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
  }

  ngOnInit() {
   // this.getUserData('admin'); 
  }

  //getUserData(userName: string) {
  //  this.userService.getUserData(userName);
  //}
}

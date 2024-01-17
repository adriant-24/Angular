import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { UserInfoComponent } from './components/user/user-info/user-info.component';
import { UserOrdersComponent } from './components/user/user-orders/user-orders.component';
import { UserAddressComponent } from './components/user/user-address/user-address.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthKeycloakGuard } from './routeguards/auth.routes';

export const routes: Routes = [
  { path: "category/:id", component: ProductListComponent },
  { path: "category/:id/:categoryName", component: ProductListComponent },
  { path: "search/:keyword", component: ProductListComponent },
  { path: "category", component: ProductListComponent },
  { path: "product/:id", component: ProductDetailsComponent },
  { path: "products", component: ProductListComponent },
  { path: "cart", component: CartDetailsComponent },
  { path: "checkout", component: CheckoutComponent, canActivate: [AuthKeycloakGuard] },
  { path: "user/userInfo", component: UserInfoComponent, canActivate: [AuthKeycloakGuard] },
  { path: "user/userAddresses", component: UserAddressComponent, canActivate: [AuthKeycloakGuard] },
  { path: "user/userOrders", component: UserOrdersComponent, canActivate: [AuthKeycloakGuard] },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "", redirectTo: "/products", pathMatch: "full" },
  { path: "**", redirectTo: "/products", pathMatch: "full" }
];

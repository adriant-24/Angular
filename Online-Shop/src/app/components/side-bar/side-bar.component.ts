import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductCategoryListComponent } from '../product/product-category-list/product-category-list.component';
import { UserInfoComponent } from '../user/user-info/user-info.component';
import { UserSidebarComponent } from '../user/user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive,
    UserSidebarComponent,
    ProductCategoryListComponent, UserInfoComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(private router: Router) { }

  showProductCategorySideBar() {
    return true;
  }

  showUserSideBar() {
    return this.router.url.includes("/user/");
  }
}

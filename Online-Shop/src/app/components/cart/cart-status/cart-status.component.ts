import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';

import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LocalstorageService } from '../../../storage/local-storage';
import { User } from '../../../common/user';

@Component({
  selector: 'app-cart-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent {
  totalPrice: number = 0;
  totalQuantity: number = 0;
  user: User = new User();

  constructor(private cartService: CartService,
    private route: ActivatedRoute,
    private localStorage: LocalstorageService) { }

  ngOnInit() {
    this.updateCartStatus();
    if (this.localStorage.getItem('userdetails')) {
      this.user = JSON.parse(this.localStorage.getItem('userdetails')!);
    }
  }
  updateCartStatus() {

    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);

    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

  }

  login() {

  }

  logout() {

  }


}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../common/cart-item';

import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LocalstorageService } from '../../../storage/local-storage';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor(private cartService: CartService,
    private route: ActivatedRoute,
    private localStorage: LocalstorageService) { }

  ngOnInit() {
    this.listCarditems();
  }

  listCarditems() {

    this.cartItems = this.cartService.cartItems;
    //if (this.localStorage.getItem('cartItems')) {
    //  this.cartItems = JSON.parse(this.localStorage.getItem('cartItems')!);
    //}

    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);

    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

   // this.cartService.computeCartTotals();
  }

  incrementItemsNumber(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decrementItemsNumber(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
  }

  removeCartItem(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem);
  }

  
}

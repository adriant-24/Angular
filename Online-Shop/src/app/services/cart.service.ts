import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { LocalstorageService } from '../storage/local-storage';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  constructor(private localStorage: LocalstorageService) {

    if (this.localStorage.getItem('cartItems')) {
      this.cartItems = JSON.parse(this.localStorage.getItem('cartItems')!);
      this.computeCartTotals(false);
    }
  }

  addToCart(cartItem: CartItem) {

    //check if item in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      //find item based on id
      existingCartItem = this.cartItems.find((item) => item.productId == cartItem.productId);
      //check if found
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart)
      existingCartItem!.quantity++;
    else
      this.cartItems.push(cartItem);

    this.computeCartTotals();
  }

  removeFromCart(cartItem: CartItem) {

    //check if item in cart
    let index: number;

    index = this.cartItems.findIndex((item) => item.productId == cartItem.productId);
    //check if found
    this.cartItems.splice(index, 1);

    this.computeCartTotals();
  }
  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity == 0)
      this.removeFromCart(cartItem);
    else
      this.computeCartTotals();
  }

  saveCartItemsInLocalStorage() {
    this.localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
  }

  computeCartTotals(saveToLocalStorage:boolean = true) {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let item of this.cartItems) {
      totalPriceValue += item.quantity * item.unitPrice;

      totalQuantityValue += item.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    if (saveToLocalStorage)
      this.saveCartItemsInLocalStorage();
  }
}

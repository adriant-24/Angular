import { CartItem } from "./cart-item";

export class OrderItem {

  orderItemId: number = -1;
  imageUrl: string = '';
  itemName: string = '';
  unitPrice: number = 0;
  quantity: number = 0;
  productId: number = 0;

  constructor(cartItem: CartItem) {
    this.imageUrl = cartItem.imageUrl;
    this.itemName = cartItem.name;
    this.unitPrice = cartItem.unitPrice
    this.quantity = cartItem.quantity;
    this.productId = cartItem.productId;
  }
}

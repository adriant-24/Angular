import { Product } from "./product"
export class CartItem {
  public productId: number;
  public name: string;
  public imageUrl: string;
  public unitPrice: number;

  public quantity: number;
  constructor(product: Product) {

    this.productId = product.productId;
    this.name = product.name;
    this.imageUrl = product.imageUrl;
    this.unitPrice = product.unitPrice;

    this.quantity = 1;
  }
}

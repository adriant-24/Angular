import { ContactInfo } from "./contact-info";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {

  order!: Order;
  shippingContactInfo!: ContactInfo;
  billingContactInfo!: ContactInfo;
  orderItems: OrderItem[] = [];
}

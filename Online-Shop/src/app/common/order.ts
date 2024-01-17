import { ContactInfo } from "./contact-info";
import { OrderItem } from "./order-item";
import { User } from "./user";

export class Order {

  orderId: number = -1;
  orderTrackingNumber: String = '';
  totalQuantity: number = -1;
  totalPrice: number = -1;
  status: String = '';
  payType: String = '';
  isPaid: boolean = false;
  userId: number = -1;
  orderItems: OrderItem[] = [];
  dateCreated: Date = new Date();
  shippingContactInfo: ContactInfo = new ContactInfo();
  billingContactInfo: ContactInfo = new ContactInfo();
  
  //user: User = new User();
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CheckoutFormService } from '../../services/checkout-form.service';
import { CartService } from '../../services/cart.service';
import { CustomValidator } from '../../validators/custom-validator';
import { UserService } from '../../services/user.service';
import { User } from '../../common/user';
import { Address } from '../../common/address';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { ContactInfo } from '../../common/contact-info';
import { LocalstorageService } from '../../storage/local-storage';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  cardMonths: number[] = [];
  cardYears: number[] = [];
  user!: User;
  orderTrackingNumber: string = '';
  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    private userService:UserService,
    private checkoutFormService: CheckoutFormService,
    private route: ActivatedRoute,
    private router: Router,
    private localStorage: LocalstorageService) { }

  ngOnInit() {
    this.getCardMonthsAndYears();

    this.getOrderTotals();

    this.checkoutFormGroup = this.formBuilder.group({
      //customer: this.formBuilder.group({
      //  firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
      //  lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
      //  email: new FormControl('', [
      //    Validators.required,
      //    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      //  phoneNumber: new FormControl('', [Validators.required, Validators.minLength(4)])
      //}),
      shipping: this.formBuilder.group({
        shippingContactInfo: this.formBuilder.group({
          firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          email: new FormControl('', [
            Validators.required,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
          phoneNumber: new FormControl('', [Validators.required, Validators.minLength(4)])
        }),
        shippingAddress: this.formBuilder.group({
          country: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          county: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          additionalInfo: [''],
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace])
        })
      }),
      billing: this.formBuilder.group({
        billingContactInfo: this.formBuilder.group({
          firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          email: new FormControl('', [
            Validators.required,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
          phoneNumber: new FormControl('', [Validators.required, Validators.minLength(4)])
        }),
        billingAddress: this.formBuilder.group({
          country: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          county: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
          additionalInfo: [''],
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace])
        })
      }),
      //billingContactInfo: this.formBuilder.group({
      //  firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
      //  lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
      //  email: new FormControl('', [
      //    Validators.required,
      //    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      //  phoneNumber: new FormControl('', [Validators.required, Validators.minLength(4)]),
      //  country: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
      //  street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
      //  city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
      //  county: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
      //  additionalInfo: [''],
      //  zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace])
      //}),
      cardInfo: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('Test Namr', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
        cardNumber: new FormControl('1234567890123456', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('123', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('1', [Validators.required]),
        expirationYear: new FormControl('2024', [Validators.required])
      })
    });


    if (window.sessionStorage.getItem('userdetails')) {
      this.user = JSON.parse(window.sessionStorage.getItem('userdetails')!);
      this.patchUserInfoData();
    }
    
  }

  patchUserInfoData() {
    //this.userService.user$.subscribe(data => {
    //  this.user = data;
      
    //});
    this.patchUserInfoFormValues();
    this.patchUserAddressInfo();
  }

  //updateUserData() {
  //  let user: User = this.user;

  //  user.addresses[1].country = "zzzzzz";
  //  this.userService.updateUserData(user);

  //  this.userService.user$.subscribe(data => {
  //    this.user = data;
  //    this.patchUserInfoFormValues();
  //    this.patchUserAddressInfo();
  //  });
  //}

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order: Order = new Order();

    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    order.payType = 'Credit Card';
    order.isPaid = true;
    order.status = "Placed";
    order.userId = 1;//cd this.user.userId;

    //order items
    let orderItems: OrderItem[] = this.cartService.cartItems
      .map(cartItem => new OrderItem(cartItem));

    let purchase: Purchase = new Purchase();

    purchase.order = order;
    purchase.orderItems = orderItems;
    purchase.billingContactInfo = this.setPurchaseBillingContactInfo();
    purchase.shippingContactInfo = this.setPurchaseShippingContactInfo();

    this.checkoutFormService.placeOrder(purchase).subscribe({
        next: response => {
          this.orderTrackingNumber = response.body.orderTrackingNumber;
          alert(`Order placed. Tracking number: ${this.orderTrackingNumber}`);

        this.resetCart();
        },
        error: err => {
          alert(`There was an error while placing the order: ${err.message}`);
        }
      });
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
  }

  setPurchaseShippingContactInfo(): ContactInfo {
    let shippingContactInfo: ContactInfo = new ContactInfo;
    shippingContactInfo.firstName = this.shippingFirstName.value;
    shippingContactInfo.lastName = this.shippingLastName.value;
    shippingContactInfo.email = this.shippingEmail.value;
    shippingContactInfo.phoneNumber = this.shippingPhoneNumber.value;
    shippingContactInfo.country = this.shippingCountry.value;
    shippingContactInfo.city = this.shippingCity.value;
    shippingContactInfo.county = this.shippingCounty.value;
    shippingContactInfo.streetAndNumber = this.shippingStreet.value;
    shippingContactInfo.zipCode = this.shippingZipCode.value;
    shippingContactInfo.additionalAddress = this.shippingAdditionalInfo.value;
   // shippingContactInfo.observations = this.shipping.value;
    shippingContactInfo.infoType = "shipping";
    return shippingContactInfo;

  }
  setPurchaseBillingContactInfo(): ContactInfo {
    let billingContactInfo: ContactInfo = new ContactInfo;
    billingContactInfo.firstName = this.billingFirstName.value;
    billingContactInfo.lastName = this.billingLastName.value;
    billingContactInfo.email = this.billingEmail.value;
    billingContactInfo.phoneNumber = this.billingPhoneNumber.value;
    billingContactInfo.country = this.billingCountry.value;
    billingContactInfo.city = this.billingCity.value;
    billingContactInfo.county = this.billingCounty.value;
    billingContactInfo.streetAndNumber = this.billingStreet.value;
    billingContactInfo.zipCode = this.billingZipCode.value;
    billingContactInfo.additionalAddress = this.billingAdditionalInfo.value;
    // billingContactInfo.observations = this.billing.value;
    billingContactInfo.infoType = "billing";
    return billingContactInfo;

  }

  patchUserInfoFormValues() {
    this.checkoutFormGroup.get("shipping")!.patchValue({
      shippingContactInfo: {
        firstName: this.user.userInfo.firstName,
        lastName: this.user.userInfo.lastName,
        email: this.user.userInfo.email,
        phoneNumber: this.user.userInfo.phone
      }
    });
    this.checkoutFormGroup.get("billing")!.patchValue({
      billingContactInfo: {
        firstName: this.user.userInfo.firstName,
        lastName: this.user.userInfo.lastName,
        email: this.user.userInfo.email,
        phoneNumber: this.user.userInfo.phone
      }
    });
  }

  patchUserAddressInfo() {
    
    if (this.user.addresses.length == 0)
      return;

    let primAddress: Address = this.user.addresses[0];

    for (let a of this.user.addresses) {
      if (a.isPrimary) { 
        primAddress = a;
        break; 
      }
    }

    this.checkoutFormGroup.get("shipping")!.patchValue({
      shippingAddress: {
        country: primAddress.country,
        street: primAddress.streetAndNumber,
        city: primAddress.city,
        county: primAddress.county,
        additionalInfo: primAddress.additionalAddress,
        zipCode: primAddress.zipCode
      }
    });
    this.checkoutFormGroup.get("billing")!.patchValue({
      billingAddress: {
        country: primAddress.country,
        street: primAddress.streetAndNumber,
        city: primAddress.city,
        county: primAddress.county,
        additionalInfo: primAddress.additionalAddress,
        zipCode: primAddress.zipCode
        }
    });
  }



  getOrderTotals() {
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
    //this.cartService.computeCartTotals();
  }

  get shippingFirstName() {
    return this.checkoutFormGroup.get("shipping")!.get("shippingContactInfo")!.get("firstName")!;
  }

  get shippingLastName() {
    return this.checkoutFormGroup.get("shipping")!.get("shippingContactInfo")!.get("lastName")!;
  }

  get shippingEmail() {
    return this.checkoutFormGroup.get("shipping")!.get("shippingContactInfo")!.get("email")!;
  }

  get shippingPhoneNumber() {
    return this.checkoutFormGroup.get("shipping")!.get("shippingContactInfo")!.get("phoneNumber")!;
  }

  get shippingCountry() {
    return this.checkoutFormGroup.get("shipping")!.get("shippingAddress")!.get("country")!;
  }

  get shippingStreet() {
    return this.checkoutFormGroup.get("shipping")!.get("shippingAddress")!.get("street")!;
  }

  get shippingCity() {
    return this.checkoutFormGroup.get("shipping")!.get("shippingAddress")!.get("city")!;
  }

  get shippingCounty() {
    return this.checkoutFormGroup.get("shipping")!.get("shippingAddress")!.get("county")!;
  }

  get shippingAdditionalInfo() {
    return this.checkoutFormGroup.get("shipping")!.get("shippingAddress")!.get("additionalInfo")!;
  }

  get shippingZipCode() {
    return this.checkoutFormGroup.get("shipping")!.get("shippingAddress")!.get("zipCode")!;
  }

  get billingFirstName() {
    return this.checkoutFormGroup.get("billing")!.get("billingContactInfo")!.get("firstName")!;
  }

  get billingLastName() {
    return this.checkoutFormGroup.get("billing")!.get("billingContactInfo")!.get("lastName")!;
  }

  get billingEmail() {
    return this.checkoutFormGroup.get("billing")!.get("billingContactInfo")!.get("email")!;
  }

  get billingPhoneNumber() {
    return this.checkoutFormGroup.get("billing")!.get("billingContactInfo")!.get("phoneNumber")!;
  }
  get billingCountry() {
    return this.checkoutFormGroup.get("billing")!.get("billingAddress")!.get("country")!;
  }

  get billingStreet() {
    return this.checkoutFormGroup.get("billing")!.get("billingAddress")!.get("street")!;
  }

  get billingCity() {
    return this.checkoutFormGroup.get("billing")!.get("billingAddress")!.get("city")!;
  }

  get billingCounty() {
    return this.checkoutFormGroup.get("billing")!.get("billingAddress")!.get("county")!;
  }

  get billingAdditionalInfo() {
    return this.checkoutFormGroup.get("billing")!.get("billingAddress")!.get("additionalInfo")!;
  }

  get billingZipCode() {
    return this.checkoutFormGroup.get("billing")!.get("billingAddress")!.get("zipCode")!;
  }

  get cardType() {
    return this.checkoutFormGroup.get("cardInfo")!.get("cardType")!;
  }

  get nameOnCard() {
    return this.checkoutFormGroup.get("cardInfo")!.get("nameOnCard")!;
  }

  get cardNumber() {
    return this.checkoutFormGroup.get("cardInfo")!.get("cardNumber")!;
  }

  get securityCode() {
    return this.checkoutFormGroup.get("cardInfo")!.get("securityCode")!;
  }

  get expirationMonth() {
    return this.checkoutFormGroup.get("cardInfo")!.get("expirationMonth")!;
  }

  get expirationYear() {
    return this.checkoutFormGroup.get("cardInfo")!.get("expirationYear")!;
  }



  copyShippingContactInfoToBillingContactInfo(checked?:boolean) {

    if (checked)
      this.checkoutFormGroup.controls['billingContactInfo']
        .setValue(this.checkoutFormGroup.controls['shippingContactInfo'].value);
    else
      this.checkoutFormGroup.controls['billingContactInfo'].reset();

  }

  getCardMonthsAndYears() {

    this.checkoutFormService.getCreditCardMonths(1).subscribe(data => this.cardMonths = data);
    this.checkoutFormService.getCreditCardYears().subscribe(data => this.cardYears = data);
  }

  handleMonthsAndYears(selectedYear: string) {

    const startMonth: number = this.getStartMonth(+selectedYear);

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(data => this.cardMonths = data);
  }

  getStartMonth(selectedYear: number): number {

    if (selectedYear == -1)
      return 1;

    const currentYear: number = new Date().getFullYear();
    let startMonth: number = 1;
    if (selectedYear == currentYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else
      startMonth = 1;

    return startMonth;
  }

}

function next(value: any): void {
    throw new Error('Function not implemented.');
}

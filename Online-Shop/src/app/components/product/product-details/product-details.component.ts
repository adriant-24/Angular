import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../common/product';
import { CartItem } from '../../../common/cart-item';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  product!: Product;
  constructor(private productService: ProductService,
    private cartService: CartService
    , private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.productById();
    })
  }

  productById() {
    const hasCategoryid: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryid) {
      const productId: number = +this.route.snapshot.paramMap.get("id")!;
      this.productService
        .getProductById(productId)
        .subscribe(data => { this.product = data });
    }
  }

  addToCart(): void {
    const cartItem = new CartItem(this.product);

    this.cartService.addToCart(cartItem);
  }
}

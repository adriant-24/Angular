import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../common/product';
import { CartItem } from '../../../common/cart-item';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  keyword: string = "";
  searchMode: boolean = false;
  totalElements: number = 0;
  totalPages: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  cartItems: CartItem[] = [];

  currentSearchDescription: string = '';
  constructor(private productService: ProductService,
    private cartService: CartService,
    private userService: UserService, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => { 
      this.fetchProducts();
    })
  }



  fetchProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode)
      this.listOfProductsSearchBy();
    else
      this.listOfProductsByCategory();
  }
  listOfProductsByCategory() {
    let categoryName: string = '';
    const hasCategoryid: boolean = this.route.snapshot.paramMap.has("id");

    const hasCategoryName: boolean = this.route.snapshot.paramMap.has("categoryName");

   

    if (hasCategoryid && hasCategoryName) {
      if (this.previousCategoryId != this.currentCategoryId) {
        this.pageNumber = 1;
      }
      this.previousCategoryId = this.currentCategoryId;
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
      categoryName = this.route.snapshot.paramMap.get("categoryName")!;
      this.currentSearchDescription = `Category: ${categoryName}`;
      this.productService
        .getProductListByCategoryPaginated( this.pageNumber - 1,
                                            this.pageSize,
                                            this.currentCategoryId)
                                            .subscribe(data => {
                                              this.products = data.products,
                                                this.totalElements = data.totalItems,
                                                this.totalPages = data.totalPages
                                            });
    }
    else {
      //in case of all products we set previous to -1.
      //For the case where going from a category to all products to reset the page number to 1.
      if (this.previousCategoryId != -1) {
        this.pageNumber = 1;
      }
      this.previousCategoryId = -1;
      this.currentSearchDescription = `Category: "All"`;
      this.productService
        .getProductList(this.pageNumber - 1,
                        this.pageSize)
                      .subscribe(data => {
                        this.products = data.products,
                          this.totalElements = data.totalItems,
                          this.totalPages = data.totalPages
                      });
    }
    


  }

  listOfProductsSearchBy() {
    
    this.keyword = this.route.snapshot.paramMap.get("keyword")!;
    this.currentSearchDescription = `Search results for: "${this.keyword}"`;
    if(this.keyword != '')
      this.productService
        .getProductListSearchBy(this.pageNumber - 1,
                                this.pageSize,
                                this.keyword,)
                              .subscribe(data => {
                                this.products = data.products,
                                  this.totalElements = data.totalItems,
                                  this.totalPages = data.totalPages
                              });

  }

  updatePageSize(pageSize: string): void {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.fetchProducts(); 
  }

  addToCart(product: Product): void {
    console.log("Product Name to cart:" + product.name);

    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }

}

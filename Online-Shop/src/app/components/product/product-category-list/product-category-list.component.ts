import { Component, afterNextRender, afterRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../../common/product-category';
import { LocalstorageService } from '../../../storage/local-storage';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.css'
})
export class ProductCategoryListComponent {

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService,
    private localStorage: LocalstorageService
    /*, private route: ActivatedRoute*/) { }

  ngOnInit() {

    if (this.localStorage.getItem('productCategories')) {
      this.productCategories = JSON.parse(this.localStorage.getItem('productCategories')!);
    }
    else
      this.listOfCategories();
    
  }

  listOfCategories() {
    this.productService
      .getProductCategoryList()
      .subscribe(data =>
        {
          this.productCategories = data;
          this.localStorage.setItem('productCategories', JSON.stringify(data));
        });

  }
}

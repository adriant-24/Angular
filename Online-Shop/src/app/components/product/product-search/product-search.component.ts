import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../common/product';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css'
})
export class ProductSearchComponent {
  constructor(private router:Router) { }

  doSearch(keyword: string) {
    this.router.navigateByUrl(`/search/${keyword}`)
  }

}

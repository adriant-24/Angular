import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { ProductCategory } from '../common/product-category';
import { Observable} from 'rxjs';
import { map} from 'rxjs/operators';

@Injectable({
    providedIn:'root'
 })

export class ProductCategoryService{

  private baseCategoryUrl = 'http://localhost:8080/api/categories';


  constructor(private httpClient: HttpClient){}

  getProductCategoryList(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.baseCategoryUrl).
      pipe(map(response => response));

  }

}

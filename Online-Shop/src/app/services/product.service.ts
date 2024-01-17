import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { Observable} from 'rxjs';
import { map} from 'rxjs/operators';

@Injectable({
    providedIn:'root'
 })

export class ProductService{

  private baseUrl = 'http://localhost:8080/api';
  private baseCategoryUrl = 'http://localhost:8080/api/categories';
  constructor(private httpClient: HttpClient){}

  getProductList(page: number,
                 size: number): Observable<GetPaginatedResponse> {
    const params = this.httpParams(page, size);
    return this.httpClient.get<GetPaginatedResponse>(`${this.baseUrl}/products`, { params });
      //.pipe(map(response => response));

  }


  getProductListByCategory(categoryId: number): Observable<Product[]>{

    const searchUrl: string = `${this.baseUrl}/products/category?id=${categoryId}`;
    return this.httpClient.get<Product[]>(searchUrl)
      .pipe(map(response => response));

  }

  getProductListByCategoryPaginated(page: number,
                                    size: number,
                                    categoryId: number): Observable<GetPaginatedResponse> {
    const params = this.httpParams(page, size);
    const searchUrl: string = `${this.baseUrl}/products/category?id=${categoryId}`;
    return this.httpClient.get<GetPaginatedResponse>(searchUrl, { params });

  }

  getProductCategoryList(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.baseCategoryUrl).
      pipe(map(response => response));

  }

  getProductListSearchBy( page: number,
                          size: number,
                          keyword: string): Observable<GetPaginatedResponse> {
    const params = this.httpParams(page, size);
    const searchUrl: string = `${this.baseUrl}/products/search?keyword=${keyword}`;
    return this.httpClient.get<GetPaginatedResponse>(searchUrl, { params });
  }

  getProductById(productId: number) {
    const searchUrl: string = `${this.baseUrl}/product?id=${productId}`;
    return this.httpClient.get<Product>(searchUrl).
      pipe(map(response => response));
  }

  httpParams(page:number, size:number): HttpParams {
    return new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  }

}

interface GetResponse{
  _embeded:{
    products:Product[];
  }
}
interface GetPaginatedResponse {
  totalItems: number;
  totalPages: number;
  products: Product[]; 
}

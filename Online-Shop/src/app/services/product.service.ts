import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { Observable, throwError} from 'rxjs';
import { catchError, map} from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn:'root'
 })

export class ProductService{

  constructor(private httpClient: HttpClient){}

  getProductList(page: number,
                 size: number): Observable<GetPaginatedResponse> {
    const params = this.httpParams(page, size);
    return this.httpClient.get<GetPaginatedResponse>(`${environment.rootUrl}/products`, { params });
      //.pipe(map(response => response));

  }


  getProductListByCategory(categoryId: number): Observable<Product[]>{

    const searchUrl: string = `${environment.rootUrl}/products/category?id=${categoryId}`;
    return this.httpClient.get<Product[]>(searchUrl)
      .pipe(map(response => response));

  }

  getProductListByCategoryPaginated(page: number,
                                    size: number,
                                    categoryId: number): Observable<GetPaginatedResponse> {
    const params = this.httpParams(page, size);
    const searchUrl: string = `${environment.rootUrl}/products/category?id=${categoryId}`;
    return this.httpClient.get<GetPaginatedResponse>(searchUrl, { params })
      .pipe(map(response => response));
     // .pipe(catchError(this.errorHandler));

  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message || "server error."));
  }
  getProductCategoryList(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(`${environment.rootUrl}/categories`).
      pipe(map(response => response));

  }

  getProductListSearchBy( page: number,
                          size: number,
                          keyword: string): Observable<GetPaginatedResponse> {
    const params = this.httpParams(page, size);
    const searchUrl: string = `${environment.rootUrl}/products/search?keyword=${keyword}`;
    return this.httpClient.get<GetPaginatedResponse>(searchUrl, { params });
  }

  getProductById(productId: number) {
    const searchUrl: string = `${environment.rootUrl}/product?id=${productId}`;
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

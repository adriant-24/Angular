import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Purchase } from '../common/purchase';
import { environment } from '../../environments/environment';
import { AppConstants } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  constructor(private httpClient: HttpClient) { }

 // private baseUrl = 'http://localhost:8080/api';

  placeOrder(purchase: Purchase): Observable<any> {

    return this.httpClient.post<Purchase>(environment.rootUrl + AppConstants.CHECKOUT_API_URL, purchase, { observe: 'response', withCredentials: true });

  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let months: number[] = [];

    for (let monthNr = startMonth; monthNr <= 12; monthNr++)
      months.push(monthNr);

    return of(months);
  }

  getCreditCardYears(): Observable<number[]> {

    let years: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let year = startYear; year <= endYear; year++)
      years.push(year);

    return of(years);
  }
}

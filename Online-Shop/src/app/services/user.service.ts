import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, filter, map, of, switchMap, take, tap } from 'rxjs';
import { User } from '../common/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address } from '../common/address';
import { Order } from '../common/order';
import { environment } from '../../environments/environment';
import { AppConstants } from '../constants/app.constants';
import { LocalstorageService } from '../storage/local-storage';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userId: number = -1;
  public user$ = new BehaviorSubject<User>(new User());
  public orders$ = new BehaviorSubject<Order[]>([]);
  public firstName$: Subject<string> = new BehaviorSubject<string>('aa');
  private address$: Subject<Address[]> = new BehaviorSubject<Address[]>([]);
  private baseUrl = 'http://localhost:8080/api';
  constructor(private httpClient: HttpClient,
    private localStorage: LocalstorageService) {
    //this.getUser().subscribe(data => this.user = data);
    //console.log(this.user);
  }

  //public listenToUserChanges(): Observable<User> {
  //  return this.cartContent$.asObservable();
  //}

  validateLoginDetails(user: User):any {
    this.localStorage.setItem("userdetails", JSON.stringify(user));
    const url = 'http://localhost:8080/userLogin';
    return this.httpClient.get(`${environment.rootUrl}${AppConstants.LOGIN_API_URL}`, { observe: 'response', withCredentials: true });
  }

  getUserData(userName: string)/*: Observable<User>*/ {
    const params = new HttpParams().set('userName', userName);

    this.httpClient.get<User>(`${environment.rootUrl}${AppConstants.USER_DATA_API_URL}`, { params })
      .subscribe(response => {
        this.userId = response.userId;
        this.user$.next(response);
       });
  }

  getUserOrders(
                page: number,
                size: number): Observable<GetPaginatedResponse | null> {
    let params = this.httpParamsPagination(page, size);

    if (window.sessionStorage.getItem("userdetails")) {
      const user = JSON.parse(window.sessionStorage.getItem("userdetails")!);
      params = params.append("userName", user.userInfo.email);
    }
    

    return this.httpClient.get<GetPaginatedResponse>
      (`${environment.rootUrl}${AppConstants.ORDERS_API_URL}`,
        { params, observe: 'response', withCredentials: true })
      .pipe(map(response => response.body));
  }

  updateUserData(user: User) {
    of(user).subscribe(response => {
      this.user$.next(response);
    });
  }

  httpParams(userName: string): HttpParams {
    return new HttpParams()
      .set('userName', userName)
  }

  httpParamsPagination(page: number,
                       size: number): HttpParams {
    return new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  }


}
interface GetPaginatedResponse {
  totalItems: number;
  totalPages: number;
  orders: Order[];
}

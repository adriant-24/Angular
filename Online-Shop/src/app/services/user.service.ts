import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, filter, map, of, switchMap, take, tap } from 'rxjs';
import { User } from '../common/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address } from '../common/address';
import { Order } from '../common/order';
import { environment } from '../../environments/environment';
import { AppConstants } from '../constants/app.constants';
import { LocalstorageService } from '../storage/local-storage';
import { KeycloakProfile } from 'keycloak-js';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userId: number = -1;
  public user$ = new BehaviorSubject<User>(new User());
  public orders$ = new BehaviorSubject<Order[]>([]);
  public firstName$: Subject<string> = new BehaviorSubject<string>('aa');
  public userAddresses$: Subject<Address[]> = new BehaviorSubject<Address[]>([]);
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
      params = params.append("userName", user.userName);
    }
    

    return this.httpClient.get<GetPaginatedResponse>
      (`${environment.rootUrl}${AppConstants.ORDERS_API_URL}`,
        { params, observe: 'response', withCredentials: true })
      .pipe(map(response => response.body));
  }

  getUserAddresses(){
    let params;

    if (window.sessionStorage.getItem("userdetails")) {
      const user = JSON.parse(window.sessionStorage.getItem("userdetails")!);
      params = this.httpParams(user.userName);//params.append("userName", user.userName);
    }


    return this.httpClient.get<Address[]>
      (`${environment.rootUrl}${AppConstants.ADDRESSES_API_URL}`,
        { params, observe: 'response', withCredentials: true })
      .subscribe(response => {
        this.userAddresses$.next(<any>response.body);
      });
     // .pipe(map(response => response.body));
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

  setUserDetails(userProfile: KeycloakProfile): User {
    let user = new User();

    user.userName = userProfile.username || '';
    user.userInfo.firstName = userProfile.firstName || '';
    user.userInfo.lastName = userProfile.lastName || '';
    user.userInfo.email = userProfile.email || '';
    let attributes = userProfile['attributes' as keyof KeycloakProfile];
    if (attributes) {
      // @ts-ignore
      user.userInfo.phone = attributes.Phone;
      // @ts-ignore
      user.userInfo.birthDate = new Date(attributes.Birthdate);
    }
    user.authStatus = 'AUTH';
    window.sessionStorage.setItem('userdetails', JSON.stringify(user));
    return user;
  }


}
interface GetPaginatedResponse {
  totalItems: number;
  totalPages: number;
  orders: Order[];
}

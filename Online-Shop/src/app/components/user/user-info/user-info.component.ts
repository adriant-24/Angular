import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserInfo } from '../../../common/user-info';
import { LocalstorageService } from '../../../storage/local-storage';


@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit{

  userInfo!: UserInfo;
  constructor(private userService: UserService,
    private localStorage: LocalstorageService) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    //this.userService.user$.subscribe(
    //  data => this.userInfo = data.userInfo
    //);
    if (this.localStorage.getItem('userdetails')) {
      this.userInfo = JSON.parse(this.localStorage.getItem('userdetails')!).userInfo;
    }
  }

}

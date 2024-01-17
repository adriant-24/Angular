import { Component, OnInit } from '@angular/core';
import { User } from '../../common/user';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../storage/local-storage';


@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {

  user = new User();
  constructor(private router: Router,
    private localStorage: LocalstorageService) {

  }

  ngOnInit(): void {
    this.localStorage.setItem("userdetails", "");
    this.localStorage.setItem("XSRF-TOKEN", "");
    this.router.navigate(['/login'])
      .then(() => {
      window.location.reload();
    });
  }
}

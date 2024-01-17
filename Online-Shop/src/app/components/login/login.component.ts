import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CustomValidator } from '../../validators/custom-validator';
import { User } from '../../common/user';
import { UserService } from '../../services/user.service';
import { LocalstorageService } from '../../storage/local-storage';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginFormGroup!: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private localStorage: LocalstorageService,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
      email: new FormControl('', [
          Validators.required/*,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")*/
      ]),
      password: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace])
    });
  }

  get email() { return this.loginFormGroup.get("email")!; }
  get password() { return this.loginFormGroup.get("password")!; }

  onSubmit() {
    let user = new User();
    user.userName = this.email.value;
    user.password = this.password.value;

    this.userService.validateLoginDetails(user).subscribe(
        (      response: {
            headers: any; body: any; 
            }) => {
        let model = new User();
        model = <any>response.body;
        let xsrf = this.cookieService.get('XSRF-TOKEN');
        this.localStorage.setItem('XSRF-TOKEN', xsrf);
        model.authStatus = 'AUTH';
        const u: string = JSON.stringify(model);
        console.log('AAAAAAA User:' + u);
        this.localStorage.setItem('userdetails', u);

        this.localStorage.setItem('Authorization', response.headers.get('Authorization'));
        this.router.navigateByUrl("/products")
          .then(() => {
            window.location.reload();
          });;
    })

  }
}

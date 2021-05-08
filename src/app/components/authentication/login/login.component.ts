import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  private errorMessage: string;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: any) {this.emailCtrl = formBuilder.control('', Validators.required);
                                                   this.passwordCtrl = formBuilder.control('', Validators.required);
                                                   this.loginForm = formBuilder.group({
      email: this.emailCtrl,
      password: this.passwordCtrl,
    }); }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  onSubmit() {
    this.authenticationService.login(this.loginForm.value).subscribe(user => {
      localStorage.setItem('token', user.token);
      localStorage.setItem('user_id', user._id);
      localStorage.setItem('permissions', user.permissionLevel);
      this.router.navigate(['home']).then();
    }, (error) => {
      switch (error.status) {
        case 401:
          this.errorMessage = 'Email or password is wrong!';
          break;
        case 400:
          this.errorMessage = 'Fields can\'t be empty!';
      }
    });
  }
}

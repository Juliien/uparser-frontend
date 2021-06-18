import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {UserService} from '../../../services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  errorMessage: string;
  isChangePasswordEnable: boolean;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public authenticationService: AuthenticationService,
              private userService: UserService
  ) {
    this.emailCtrl = formBuilder.control('', Validators.required);
    this.passwordCtrl = formBuilder.control('', Validators.required);

    this.loginForm = formBuilder.group({
      email: this.emailCtrl,
      password: this.passwordCtrl,
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isLogged() === true) {
      this.router.navigate(['home']).then();
    }
  }

  onSubmit(): void {
    this.authenticationService.login(this.loginForm.value).subscribe(result => {
      this.authenticationService.token = result.token;
      localStorage.setItem('token', result.token);
      this.authenticationService.decodedToken = this.authenticationService.decodeToken(result.token);
      this.router.navigate(['home']).then();
    }, (error) => {
      switch (error.status) {
        case 403:
          this.errorMessage = 'E-mail ou mot de passe incorrect !';
          break;
        case 400:
          this.errorMessage = 'Fields can\'t be empty !';
      }
    });
  }
}

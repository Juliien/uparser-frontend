import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {UserService} from '../../../services/user.service';
import {EmailModel} from '../../../models/email.model';


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
  newPassword: string;
  currentEmail: string;
  verificationCode: string;
  isChangePasswordEnable: boolean;
  isEmailSend: boolean;
  isCodeVerified: boolean;
  displayAlert: boolean;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
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
      localStorage.setItem('token', result.token);
      this.authenticationService.token = result.token;
      this.authenticationService.decodedToken = this.authenticationService.decodeToken(result.token);
      this.router.navigate(['home']).then();
    }, (error) => {
      switch (error.status) {
        case 404:
          this.errorMessage = 'E-mail ou mot de passe incorrect !';
          break;
        case 403:
          this.errorMessage = 'E-mail ou mot de passe incorrect !';
          break;
      }
    });
  }

  sendEmail(): void {
    const mailData: EmailModel = {
      mailFrom: 'uparser.support@gmail.com',
      mailTo: this.currentEmail,
      mailSubject: 'Uparser - Mot de passe perdu',
      mailContent: ''
    };
    this.userService.sendUserMail(mailData).subscribe();
    this.isEmailSend = true;
  }

  verifyUser(): void {
    const formData = {
      email: this.currentEmail,
      password: this.verificationCode
    };

    this.authenticationService.login(formData).subscribe(result => {
      this.authenticationService.token = result.token;
      this.authenticationService.decodedToken = this.authenticationService.decodeToken(result.token);

      this.userService.getUserByEmail(this.authenticationService.decodedToken.email).subscribe(user => {
        this.userService.currentUser = user;
        this.isCodeVerified = true;
        this.isEmailSend = false;
      });
    }, () => {
      this.errorMessage = 'Le code de verification est incorrect !';
    });
  }

  changePassword(): void {
    this.userService.currentUser.password = this.newPassword;
    this.userService.changeUserPassword(this.userService.currentUser).subscribe(user => {
      this.userService.currentUser = user;
      this.isChangePasswordEnable = false;
      this.displayAlert = true;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isLogged() === true) {
      this.router.navigate(['home']).then();
    }
     else {
      this.firstNameCtrl = this.formBuilder.control('', Validators.required);
      this.lastNameCtrl = this.formBuilder.control('', Validators.required);
      this.emailCtrl = this.formBuilder.control('', Validators.required);
      this.passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(6)]);

      this.registerForm = this.formBuilder.group({
        firstName: this.firstNameCtrl,
        lastName: this.lastNameCtrl,
        email: this.emailCtrl,
        password: this.passwordCtrl
      });
    }
  }

  onSubmit(): any {
    this.authenticationService.register(this.registerForm.value).subscribe( () => {
      const formData = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };
      this.authenticationService.login(formData).subscribe(result => {
        this.authenticationService.token = result.token;
        localStorage.setItem('token', result.token);
        this.authenticationService.decodedToken = this.authenticationService.decodeToken(result.token);
        this.router.navigate(['home']).then();
      });
      }, () => {
      this.errorMessage = 'Fields can\'t be empty!';
    });
  }
}

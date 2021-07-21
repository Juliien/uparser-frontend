import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  newPassword: string;
  message: string;

  constructor(public userService: UserService,
              private authService: AuthenticationService) { }

  ngOnInit(): void {
    if (!this.userService.currentUser) {
      this.userService.getUserByEmail(this.authService.decodedToken.email).subscribe(user => this.userService.currentUser = user);
    }
  }

  changePassword(): void {
    this.userService.currentUser.password = this.newPassword;
    this.userService.changeUserPassword(this.userService.currentUser).subscribe(user => {
      this.userService.currentUser = user;
      this.message = 'Le mot de passe a été mis à jour';
    }, () => {
      this.message = 'Oups une erreur est survenue !';
    });
  }
}

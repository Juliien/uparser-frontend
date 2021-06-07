import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public userService: UserService,
              private authService: AuthenticationService) { }

  ngOnInit(): void {
    if (!this.userService.currentUser) {
      this.userService.getUserByEmail({email: this.authService.decodedToken.sub}).subscribe(user => this.userService.currentUser = user);
    }
  }
}

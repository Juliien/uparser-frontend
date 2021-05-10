import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  isLogged(): boolean {
    const token = localStorage.getItem('token');
    return token && token.length > 1;
  }
}

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import jwt_decode from 'jwt-decode';
import {TokenModel} from '../models/token.model';
import {UserModel} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  token: string;
  decodedToken: TokenModel;

  constructor(private router: Router,
              private http: HttpClient) {
    if (this.isLogged()) {
      if (!this.token) {
        this.token = localStorage.getItem('token');
      }
      if (!this.decodedToken) {
        this.decodedToken = this.decodeToken(this.token);
      }
      if (!this.isTokenValid()) {
        this.logout();
      }
    }
  }

  register(user: UserModel): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    };
    return this.http.post(environment.apiUrl + 'auth/register', user, options);
  }

  login(formData: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + 'auth/login',  formData);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.router.navigate(['home']).then();
  }

  isLogged(): boolean {
    const token = localStorage.getItem('token');
    return token && token.length > 1;
  }

  isTokenValid(): boolean {
    const currentDate = Math.round(new Date().getTime() / 1000);
    return Number(this.decodedToken.exp) > currentDate;
  }

  decodeToken(token: string): any {
    return jwt_decode(token);
  }
}

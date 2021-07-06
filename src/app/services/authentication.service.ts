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
    if (this.isLogged() && !this.token) {
      this.token = localStorage.getItem('token');
      if (!this.decodedToken) {
        this.decodedToken = this.decodeToken(this.token);
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

  decodeToken(token: string): any {
    return jwt_decode(token);
  }
}

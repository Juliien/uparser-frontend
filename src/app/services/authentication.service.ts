import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from '../models/user.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  token: string;

  constructor(private router: Router,
              private http: HttpClient) {
    if (this.isLogged() && !this.token) {
      this.token = localStorage.getItem('token');
    }
  }

  register(user: User): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    };
    return this.http.post(environment.apiUrl + 'auth/register', user, options);
  }

  login(data: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    };
    return this.http.post<any>(environment.apiUrl + 'auth/login',  data, options);
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
}

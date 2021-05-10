import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public token: string;
  public email: string;

  constructor(private router: Router,
              private http: HttpClient) {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.email = localStorage.getItem('email');
    }
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
    this.email = null;
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['home']).then();
  }

  register(user: User): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    };

    return this.http.post(environment.apiUrl + 'auth/register', user, options);
  }

  // getAll() {
  //   return this.http.get<User[]>(`${environment.apiUrl}/users`);
  // }
}

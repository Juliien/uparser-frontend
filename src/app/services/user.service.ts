import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: User;

  constructor(private router: Router,
              private http: HttpClient) {}

  getUserByEmail(email: string): Observable<User> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }),
      params: new HttpParams().set('email', email)
    };
    return this.http.get<User>(environment.apiUrl + 'user', option);
  }
}

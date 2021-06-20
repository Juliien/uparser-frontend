import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserModel} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: UserModel;

  constructor(private router: Router,
              private http: HttpClient) {}

  getUserByEmail(email: string): Observable<UserModel> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }),
      params: new HttpParams().set('email', email)
    };
    return this.http.get<UserModel>(environment.apiUrl + 'user', option);
  }

  changeUserPassword(userData: UserModel): Observable<UserModel> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }),
    };
    return this.http.put<UserModel>(environment.apiUrl + 'user/password', userData,  option);
  }
}

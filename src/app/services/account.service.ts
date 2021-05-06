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
  private user: Observable<User>;

  constructor(private router: Router,
              private http: HttpClient) {}

  // login(username, password){
  //   return this.http.post<User>('${environment.apiUrl}/users/authenticate', {username, password}, options)
  //     .pipe(map(user => {
  //       localStorage.setItem('user', JSON.stringify(user));
  //       this.userSubject.next(user);
  //       return user;
  //     }));
  // }

  // logout() {
  //   // remove user from local storage and set current user to null
  //   localStorage.removeItem('user');
  //   this.userSubject.next(null);
  //   this.router.navigate(['/account/login']);
  // }

  register(user: User): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    };

    return this.http.post(environment.apiUrl + '/auth/register', user, options);
  }

  // getAll() {
  //   return this.http.get<User[]>(`${environment.apiUrl}/users`);
  // }
}

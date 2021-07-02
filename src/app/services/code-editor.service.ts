import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {KafkaModel} from '../models/kafka.model';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {

  constructor(private http: HttpClient,
              private userService: UserService) {}

  postIntoKafkaTopic(formData: KafkaModel): Observable<KafkaModel> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<KafkaModel>(environment.apiUrl + 'kafka/produce',  formData, option);
  }

  testUserCode(data: any): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<any>(environment.apiUrl + 'code/quality', data, option);
  }

  getUserCodeHistory(): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get<any>(environment.apiUrl + 'code/history/' + this.userService.currentUser.id , option);
  }
}

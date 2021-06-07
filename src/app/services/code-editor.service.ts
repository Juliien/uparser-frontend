import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {environment} from '../../environments/environment';
import {KafkaModel} from '../models/kafka.model';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {

  constructor(private http: HttpClient) {}

  postIntoKafkaTopic(formData: KafkaModel): Observable<KafkaModel> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<KafkaModel>(environment.apiUrl + 'kafka/produce',  formData, option);
  }
}

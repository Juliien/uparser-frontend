import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {KafkaModel} from '../models/kafka.model';
import {UserService} from './user.service';
import {CodeModel} from '../models/code.model';
import {RunnerOutputModel} from '../models/runner-output.model';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {

  constructor(private http: HttpClient,
              private userService: UserService) {}

  postIntoKafkaTopic(formData: KafkaModel, id: string): Observable<RunnerOutputModel> {
    return this.http.post<RunnerOutputModel>(environment.apiUrl + 'kafka/produce/' + id,  formData);
  }

  testCodeQuality(data: any): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<any>(environment.apiUrl + 'quality', data, option);
  }

  getUserCodeHistory(): Observable<CodeModel[]> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get<CodeModel[]>(environment.apiUrl + 'code/history/' + this.userService.currentUser.id , option);
  }

  isCodePlagiarism(code: any): Observable<CodeModel> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<CodeModel>(environment.apiUrl + 'quality/plagiarism', code, option);
  }

  parseFile(artifact: any): Observable<string> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<string>(environment.apiUrl + 'quality/parse', artifact, option);
  }

  addCode(code: any): Observable<CodeModel> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<CodeModel>(environment.apiUrl + 'code', code, option);
  }

  enableCodeToCatalog(code: CodeModel): Observable<CodeModel> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put<CodeModel>(environment.apiUrl + 'code', code, option);
  }
}

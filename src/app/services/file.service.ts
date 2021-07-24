import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {UserModel} from '../models/user.model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {FileModel} from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

 saveFile(file: any): Observable<FileModel> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }),
    };
    return this.http.post<FileModel>(environment.apiUrl + 'files', file, option);
  }

  getFilesByUserId(id: string): Observable<FileModel[]> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }),
    };
    return this.http.get<FileModel[]>(environment.apiUrl + 'files/user/' + id, option);
  }

  delete(id: string): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }),
    };
    return this.http.delete<any>(environment.apiUrl + 'files/' + id, option);
  }
}

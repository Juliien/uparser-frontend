import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CodeModel} from '../models/code.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private http: HttpClient) {}

  getCatalogue(): Observable<CodeModel[]> {
    return this.http.get<CodeModel[]>(environment.apiUrl + 'code/all');
  }

  getCatalogueById(id): Observable<CodeModel> {
    return this.http.get<CodeModel>(environment.apiUrl + 'code/' + id);
  }
}

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

  getCatalog(): Observable<CodeModel[]> {
    return this.http.get<CodeModel[]>(environment.apiUrl + 'catalog');
  }

  getCatalogById(id): Observable<CodeModel> {
    return this.http.get<CodeModel>(environment.apiUrl + 'catalog/item/' + id);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl
  generosUrl = environment.generosUrl

  getGeneros(): Observable<any> {
    return this.http.get(`${this.url}` + `${this.generosUrl}`);
  }
}

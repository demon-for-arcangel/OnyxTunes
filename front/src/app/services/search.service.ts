import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url = environment.baseUrl;

  constructor(private http: HttpClient) { }

  search(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}?query=${query}`);
  }
}

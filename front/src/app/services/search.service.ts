import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchResults } from '../interfaces/search-results';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url = environment.baseUrl;
  private searchUrl = environment.searchUrl;

  constructor(private http: HttpClient) { }

  search(query: string): Observable<SearchResults> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.get<SearchResults>(`${this.url}${this.searchUrl}?query=${query}`, { headers });
  }
}

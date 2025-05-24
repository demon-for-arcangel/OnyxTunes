import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SearchResults } from '../interfaces/search-results';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url = environment.baseUrl;
  private searchUrl = environment.searchUrl;

  constructor(private http: HttpClient) { }

  search(query: string): Observable<SearchResults> {
    return this.http.get<SearchResults>(this.url + this.searchUrl + `?query=${query}`);
  }
}

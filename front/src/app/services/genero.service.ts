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

  createGenero(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}` + `${this.generosUrl}` + `/new`, formData);
  }

  deleteGenero(genresIds: number[]): Observable<void> { //revisar la url
    return this.http.delete<void>(`${this.url}` + `${this.generosUrl}`, { 
      body: { songsIds: genresIds } 
    });
  }
}

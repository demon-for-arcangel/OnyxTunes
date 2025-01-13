import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '../interfaces/genre';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl;
  generosUrl = environment.generosUrl;

  getGeneros(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.url}${this.generosUrl}`);
  }

  getGeneroById(generoId: number): Observable<Genre> {
    return this.http.get<Genre>(`${this.url}${this.generosUrl}/${generoId}`);
  }

  createGenero(genero: { nombre: string }): Observable<Genre> {
    return this.http.post<Genre>(`${this.url}${this.generosUrl}/new`, genero);
  }

  updateGenero(generoId: number, updatedData: Genre): Observable<Genre> {
    return this.http.put<Genre>(`${this.url}${this.generosUrl}/${generoId}`, updatedData);
  }

  deleteGeneros(generosIds: number[]): Observable<any> {
    return this.http.request('delete', `${this.url}${this.generosUrl}`, { body: { generosIds } });
  }
}
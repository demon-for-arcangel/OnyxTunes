import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl
  generosUrl = environment.generosUrl

  getGeneros(): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.get(`${this.url}${this.generosUrl}`, { headers });
  }

  getGeneroById(generoId: number): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.get(`${this.url}${this.generosUrl}/${generoId}`, { headers });
  }

  createGenero(formData: FormData): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.post(`${this.url}${this.generosUrl}/new`, formData, { headers });
  }

  updateGenero(formData: FormData, generoId: number): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.put(`${this.url}${this.generosUrl}/${generoId}`, formData, { headers });
  }

  deleteGenero(genresIds: number[]): Observable<void> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.delete<void>(`${this.url}${this.generosUrl}`, {
      body: { generosIds: genresIds },
      headers,
    });
  }
}

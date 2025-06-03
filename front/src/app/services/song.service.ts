import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl
  songsUrl = environment.songsUrl

  getCanciones(): Observable<any> {
    return this.http.get(`${this.url}` + `${this.songsUrl}`);
  }

  getCancionById(id: number): Observable<any> {
    return this.http.get(`${this.url}` + `${this.songsUrl}` + `/${id}`);
  }

  getGenreBySong(songId: number): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.get(`${this.url}${this.songsUrl}/${songId}/genre`, { headers });
  }

  getCancionesByUser(userId: number): Observable<any> {
    const userRawData = localStorage.getItem("user");
    const userData = userRawData ? JSON.parse(userRawData) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.get(`${this.url}${this.songsUrl}/user/${userId}`, { headers });
  }

  createCancion(formData: FormData): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.post(`${this.url}${this.songsUrl}/new`, formData, { headers });
  }

  updateCancion(id: number, cancion: any): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.put(`${this.url}${this.songsUrl}/${id}`, cancion, { headers });
  }

  deleteCancion(songIds: number[]): Observable<void> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.delete<void>(`${this.url}${this.songsUrl}`, { 
      body: { songsIds: songIds },
      headers, 
    });
  }

  addToHistory(songId: number, userId: number): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.post(`${this.url}${this.songsUrl}/add/history`, { songId, userId }, { headers });
  }

  getHistoryByUser(userId: number): Observable<any> {
    return this.http.get(`${this.url}` + `${this.songsUrl}` + `/history/${userId}`);
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

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

  getCancionesByUser(userId: number): Observable<any> {
    return this.http.get(`${this.url}` + `${this.songsUrl}` + `/user/${userId}`);
  }

  createCancion(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}` + `${this.songsUrl}` + `/new`, formData);
  }

  updateCancion(id: number, cancion: any): Observable<any> {
    return this.http.put(`${this.url}` + `${this.songsUrl}` + `/${id}`, cancion);
  }

  deleteCancion(songIds: number[]): Observable<void> {
    return this.http.delete<void>(`${this.url}` + `${this.songsUrl}`, { 
      body: { songsIds: songIds } 
    });
  }

  addToHistory(songId: number, userId: number): Observable<any> {
    return this.http.post(`${this.url}` + `${this.songsUrl}` + `/add/history`, { songId, userId });
  }

  getHistoryByUser(userId: number): Observable<any> {
    return this.http.get(`${this.url}` + `${this.songsUrl}` + `/history/${userId}`);
  }
}
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

  createCancion(cancion: any): Observable<any> {
    return this.http.post(`${this.url}` + `${this.songsUrl}` + `/new`, cancion);
  }

  updateCancion(id: number, cancion: any): Observable<any> {
    return this.http.put(`${this.url}` + `${this.songsUrl}` + `/${id}`, cancion);
  }
  deleteCancion(id: number): Observable<any> {
    return this.http.delete(`${this.url}` + `${this.songsUrl}` + `/${id}`);
  }
}

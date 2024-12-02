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

  getCanciones(): Observable<any> {
    return this.http.get(`${this.url}/songs`);
  }

  getCancionById(id: number): Observable<any> {
    return this.http.get(`${this.url}/songs/${id}`);
  }

  createCancion(cancion: any): Observable<any> {
    return this.http.post(`${this.url}/songs/new`, cancion);
  }

  updateCancion(cancion: any): Observable<any> {
    return this.http.put(`${this.url}/songs/${cancion.id}`, cancion);
  }

  deleteCancion(id: number): Observable<any> {
    return this.http.delete(`${this.url}/songs/${id}`);
  }
}

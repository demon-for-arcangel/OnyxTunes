import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl

  getAlbums(): Observable<any> {
    return this.http.get(`${this.url}/albums`);
  }

  getAlbumById(id: number): Observable<any> {
    return this.http.get(`${this.url}/albums/${id}`);
  }

  createAlbum(cancion: any): Observable<any> {
    return this.http.post(`${this.url}/albums/new`, cancion);
  }

  updateAlbum(cancion: any): Observable<any> {
    return this.http.put(`${this.url}/albums/${cancion.id}`, cancion);
  }

  deleteAlbum(id: number): Observable<any> {
    return this.http.delete(`${this.url}/albums/${id}`);
  }
}

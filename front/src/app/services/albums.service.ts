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
  albumsUrl = environment.albumsUrl

  getAlbums(): Observable<any> {
    return this.http.get(`${this.url}` + `${this.albumsUrl}`);
  }

  getAlbumById(id: number): Observable<any> {
    return this.http.get(`${this.url}` + `${this.albumsUrl}` + `/${id}`);
  }

  createAlbum(cancion: any): Observable<any> {
    return this.http.post(`${this.url}` + `${this.albumsUrl}` + `/new`, cancion);
  }

  updateAlbum(cancion: any): Observable<any> {
    return this.http.put(`${this.url}` + `${this.albumsUrl}` + `/${cancion.id}`, cancion);
  }

  deleteAlbum(id: number): Observable<any> {
    return this.http.delete(`${this.url}` + `${this.albumsUrl}` + `/${id}`);
  }

  getAlbumsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.url}` + `${this.albumsUrl}` + `/user/${userId}`);
  }
}

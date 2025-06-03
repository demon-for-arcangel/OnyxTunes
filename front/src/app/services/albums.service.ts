import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';

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
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.post(`${this.url}${this.albumsUrl}/new`, cancion, { headers });
  }

  updateAlbum(id: number, cancion: any): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.put(`${this.url}${this.albumsUrl}/${id}`, cancion, { headers });
  }

  deleteAlbum(ids: number[]): Observable<void> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.delete<void>(`${this.url}${this.albumsUrl}`, {
      body: { albumsIds: ids },
      headers,
    });
  }

  getAlbumsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.url}` + `${this.albumsUrl}` + `/user/${userId}`);
  }
}

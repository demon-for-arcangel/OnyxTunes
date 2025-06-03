import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistfavoriteService {

  constructor(private http: HttpClient) { }

  private url = environment.baseUrl
  private playlistFavoriteUrl = environment.playlistFavoriteUrl
 
  getFavoritePlaylists(usuarioId: number): Observable<any> {
    const userRawData = localStorage.getItem("user");
    const userData = userRawData ? JSON.parse(userRawData) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.get(`${this.url}${this.playlistFavoriteUrl}/${usuarioId}`, { headers });
  }

  addFavoritePlaylist(usuarioId: number, playlistId: number): Observable<any> {
    const userRawData = localStorage.getItem("user");
    const userData = userRawData ? JSON.parse(userRawData) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.post(`${this.url}${this.playlistFavoriteUrl}/add`, { usuarioId, playlistId }, { headers });
  }

  removeFavoritePlaylist(usuarioId: number, playlistId: number): Observable<any> {
    const userRawData = localStorage.getItem("user");
    const userData = userRawData ? JSON.parse(userRawData) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.delete(`${this.url}${this.playlistFavoriteUrl}/remove`, {
      body: { usuarioId, playlistId },
      headers,
    });
  }

}

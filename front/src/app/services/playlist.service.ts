import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) { }

  private url = environment.baseUrl
  private playlistUrl = environment.playlistUrl


 getUserPlaylists(userId: number): Observable<any> {
    const userRawData = localStorage.getItem("user");
    const userData = userRawData ? JSON.parse(userRawData) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.get<any>(`${this.url}${this.playlistUrl}/user/${userId}`, { headers });
  }

  getPlaylistById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}${this.playlistUrl}/${id}`); 
  }

  addToFavorites(songId: number, userId: number): Observable<any> {
    const userRawData = localStorage.getItem("user");
    const userData = userRawData ? JSON.parse(userRawData) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.post<any>(`${this.url}${this.playlistUrl}/song/like`, { songId, userId }, { headers });
  }

  createPlaylist(playlistData: { nombre: string; descripcion: string; usuario_id: number; publico: boolean; canciones?: number[] }): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.post<any>(`${this.url}${this.playlistUrl}/new`, playlistData, { headers });
  }

  deleteSongPlaylist(songId: number, playlistId: number): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      console.error("❌ No hay token disponible.");
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.delete<any>(`${this.url}${this.playlistUrl}/song/delete`, {
      body: { songId, playlistId },
      headers,
    });
  }

  createPlaylistsByGenres(): Observable<any> {
    const userRawData = localStorage.getItem("user");
    const userData = userRawData ? JSON.parse(userRawData) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.post(`${this.url}${this.playlistUrl}/genre/createPlaylist`, {}, { headers });
  }

  addSongsToPlaylist(userId: number, sourcePlaylistId: number, targetPlaylistId: number): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.post<any>(`${this.url}${this.playlistUrl}/add/songs`, 
      { userId, sourcePlaylistId, targetPlaylistId }, { headers });
  }
}

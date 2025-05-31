import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistfavoriteService {

  constructor(private http: HttpClient) { }

  private url = environment.baseUrl
  private playlistFavoriteUrl = environment.playlistFavoriteUrl
 
  getFavoritePlaylists(usuarioId: number): Observable<any> {
    return this.http.get(`${this.url}${this.playlistFavoriteUrl}/${usuarioId}`);
  }

  addFavoritePlaylist(usuarioId: number, playlistId: number): Observable<any> {
    return this.http.post(`${this.url}${this.playlistFavoriteUrl}/add`, { usuarioId, playlistId });
  }

  removeFavoritePlaylist(usuarioId: number, playlistId: number): Observable<any> {
    return this.http.delete(`${this.url}${this.playlistFavoriteUrl}/remove`, { body: { usuarioId, playlistId } });
  }

}

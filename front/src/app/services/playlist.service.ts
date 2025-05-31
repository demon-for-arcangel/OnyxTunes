import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) { }

  private url = environment.baseUrl
  private playlistUrl = environment.playlistUrl


  getUserPlaylists(userId: number): Observable<any> {
    return this.http.get<any>(`${this.url}` + `${this.playlistUrl}` + `/user/${userId}`); 
  }

  getPlaylistById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}${this.playlistUrl}/${id}`); 
  }

  addToFavorites(songId: number, userId: number): Observable<any> {
    return this.http.post<any>(this.url + this.playlistUrl + '/song/like', { songId, userId });
  }

  createPlaylist(playlistData: { nombre: string; descripcion: string; usuario_id: number; publico: boolean; canciones?: number[] }): Observable<any> {
    return this.http.post<any>(`${this.url}${this.playlistUrl}/new`, playlistData);
  }

  deleteSongPlaylist(songId: number, playlistId: number): Observable<any> {
    return this.http.delete<any>(this.url + this.playlistUrl + '/song/delete', { 
      body: { 
        songId, 
        playlistId 
      } 
    });
  }

  createPlaylistsByGenres(): Observable<any> {
    return this.http.post(`${this.url}${this.playlistUrl}/genre/createPlaylist`, {});
  }
}

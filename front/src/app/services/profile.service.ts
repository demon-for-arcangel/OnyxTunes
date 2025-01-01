import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Playlist } from '../interfaces/playlist';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private url = environment.baseUrl;
  private profileUrl = environment.profileUrl;

  constructor(private http: HttpClient) { }

  getPublicPlaylists(userId: number): Observable<any> {
    return this.http.get<any>(`${this.url}${this.profileUrl}/playlist/public/${userId}`);
  }
}

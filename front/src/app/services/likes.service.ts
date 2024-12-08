import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LikeResponse } from '../interfaces/like';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  url = environment.baseUrl
  likesUrl = environment.likesUrl

  constructor(private http: HttpClient) { }

  getLikesByUserId(userId: number): Observable<LikeResponse> {
    return this.http.get<LikeResponse>(this.url + this.likesUrl + `/user/${userId}`)
  }

  deleteLike(songId: number, userId: number): Observable<any> {
    return this.http.delete<any>(this.url + this.likesUrl + `/${songId}`, {
      body: { userId } 
    });
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LikeResponse } from '../interfaces/like';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  url = environment.baseUrl
  likesUrl = environment.likesUrl

  constructor(private http: HttpClient) { }

  getLikesByUserId(userId: number): Observable<LikeResponse> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.get<LikeResponse>(`${this.url}${this.likesUrl}/user/${userId}`, { headers });
  }

  deleteLike(likeId: number): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.delete<any>(`${this.url}${this.likesUrl}/${likeId}`, { headers });
  }
}

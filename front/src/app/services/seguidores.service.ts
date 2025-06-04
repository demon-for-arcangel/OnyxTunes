import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SeguidoresService {
  private url = environment.baseUrl;
  private seguidoresUrl = environment.seguidoresUrl;

  constructor(private http: HttpClient) {}

  getFollowers(artistId: number): Observable<any> {
    return this.http.get(`${this.url}${this.seguidoresUrl}/artist/${artistId}`);
  }

  getFollowing(userId: number): Observable<any> {
    const userRawData = localStorage.getItem("user");
    const userData = userRawData ? JSON.parse(userRawData) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.get(`${this.url}${this.seguidoresUrl}/user/${userId}`, { headers });
  }

  addFollower(artistaId: number, followerId: number): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.post(`${this.url}${this.seguidoresUrl}`, { artistaId, followerId }, { headers });
  }

  removeFollower(artistaId: number, followerId: number): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.delete(this.url + this.seguidoresUrl, {
      body: { artistaId, followerId },
      headers, 
    });
  }

  getTopArtists(limit: number = 5): Observable<any> {
    return this.http.get(`${this.url}${this.seguidoresUrl}/top?limit=${limit}`);
  }
}

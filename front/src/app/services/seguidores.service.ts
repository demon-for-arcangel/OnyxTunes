import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

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
    return this.http.get(`${this.url}${this.seguidoresUrl}/user/${userId}`);
  }

  addFollower(artistaId: number, followerId: number): Observable<any> {
    console.log("URL:", this.url + this.seguidoresUrl);
    console.log("Body:", { artistaId, followerId });
    return this.http.post(this.url + this.seguidoresUrl, {
      artistaId,
      followerId,
    });
  }

  removeFollower(artistaId: number, followerId: number): Observable<any> {
    return this.http.delete(this.url + this.seguidoresUrl, {
      body: { artistaId, followerId },
    });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl

  getPlaylistByEmail(email: string): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.get<any>(`${this.url}/recomendaciones/playlist/${email}`, { headers });
  }

  getRecommendationOnLogin(userId: string): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.get<any>(`${this.url}/recomendaciones/login/${userId}`, { headers });
  }

  getRecommendationStatus(userId: string): Observable<boolean> {
    const userRawData = localStorage.getItem("user");
    const userData = userRawData ? JSON.parse(userRawData) : null;
    const token = userData?.token;

    if (!token) {
      console.error("❌ No hay token disponible.");
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.get<boolean>(`${this.url}/recomendaciones/status/${userId}`, { headers });
  }

  updateRecommendationStatus(userId: string, status: boolean): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    if (!userData?.token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    console.log("Actualizando estado de recomendaciones:", { userId, status });

    return this.http.post(
      `${this.url}/recomendaciones/update-status/${userId}`,
      { habilitada: Boolean(status) }, 
      { headers: new HttpHeaders({ "Content-Type": "application/json", "x-token": token }) }
    );
  }

  getDailyRecommendations(userId: string): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token,
    });

    return this.http.get<any>(`${this.url}/recomendaciones/daily/${userId}`, { headers });
  }
}
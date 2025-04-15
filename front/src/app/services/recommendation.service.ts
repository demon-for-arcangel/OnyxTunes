import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl
  //recommendationUrl = environment.recomendationsUrl

  getRecommendationOnLogin(userId: string): Observable<any> {
    return this.http.get<any>(`${this.url}/recomendaciones/login/${userId}`);
  }
}
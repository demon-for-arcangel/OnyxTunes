import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl

  register(userData: any): Observable<any>{
    return this.http.post(`${this.url}/register`, userData)
  }
}

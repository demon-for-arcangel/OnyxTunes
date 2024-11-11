import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl

  getArtists(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}/users/artists`)
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/usuarios`);
  }
  
  deleteUsuario(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/usuarios/${userId}`);
  }
}

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
    return this.http.get<Usuario[]>(`${this.url}/users`);
  }

  getUserById(userId: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/users/${userId}`);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.url}/users`, {
      params: { email } 
    });
  }

  getUserByToken(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/users/token`);
  }

  createUsuario(datosUser: {nombre: string, email: string, password: string, roles: string[]}): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/users/new`, datosUser);
  }
  
  deleteUsuarios(userIds: number[]): Observable<void> {
    return this.http.delete<void>(`${this.url}/users`, { 
      body: { userIds } 
    });
  }

  updateUser(userId: string, user: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/users/${userId}`, user);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
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
  usersUrl = environment.usersUrl

  getArtists(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}` + `${this.usersUrl}` + `/artists`)
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}` + `${this.usersUrl}`);
  }

  indexUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.url}` + `${this.usersUrl}`);
  }

  getUserById(userId: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}` + `${this.usersUrl}` + `/${userId}`);
  }

  getUserByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.url}` + `${this.usersUrl}` + `/found`, { params });
  }

  createUsuario(datosUser: {nombre: string, email: string, password: string, rol: number}): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}` + `${this.usersUrl}` + `/create`, datosUser);
  }
  
  deleteUsuarios(userIds: number[]): Observable<void> {
    return this.http.delete<void>(`${this.url}` + `${this.usersUrl}`, { 
      body: { userIds } 
    });
  }

  updateUser(userId: string, user: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}` + `${this.usersUrl}` + `/${userId}`, user);
  }

  updatePassword(userId: string, currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const body = {
      currentPassword,
      newPassword,
      confirmPassword
    };
    return this.http.put<any>(`${this.url}${this.usersUrl}/${userId}/password`, body);
  }
}

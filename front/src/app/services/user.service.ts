import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl
  usersUrl = environment.usersUrl

  getArtists(): Observable<Usuario[]> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.get<Usuario[]>(`${this.url}${this.usersUrl}/artists`, { headers });
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}` + `${this.usersUrl}`);
  }

  indexUsuarios(): Observable<any> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    const headers = new HttpHeaders({
      "x-token": token, 
    });

    return this.http.get<any>(`${this.url}${this.usersUrl}`, { headers });
  }

  getUserById(userId: string): Observable<Usuario> {
    const userls = localStorage.getItem("user");
    const userData = userls ? JSON.parse(userls) : null;
    const token = userData?.token;

    if (!token) {
      return throwError(() => new Error("No hay token en la petición."));
    }

    return this.http.get<Usuario>(`${this.url}${this.usersUrl}/${userId}`, {
      headers: {
        "x-token": token, 
      },
    });
  }

  getUserByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.url}` + `${this.usersUrl}` + `/found`, { params });
  }

  createUsuario(datosUser: {nombre: string, email: string, password: string, rol: number}): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}` + `${this.usersUrl}` + `/create`, datosUser);
  }
  
  deleteUsuarios(userIds: number[]): Observable<void> {
  const userls = localStorage.getItem("user");
  const userData = userls ? JSON.parse(userls) : null;
  const token = userData?.token;

  if (!token) {
    return throwError(() => new Error("No hay token en la petición."));
  }

  return this.http.delete<void>(`${this.url}${this.usersUrl}`, {
    body: { userIds },
    headers: {
      "x-token": token,
    },
  });
}

  updateUser(userId: string, user: FormData): Observable<any> {
      const userls = localStorage.getItem("user");
      const userData = userls ? JSON.parse(userls) : null;
      const token = userData?.token;

      if (!token) {
          return throwError(() => new Error("No hay token en la petición."));
      }

      const headers = new HttpHeaders({
          "x-token": token, 
      });

      return this.http.put<any>(`${this.url}${this.usersUrl}/${userId}`, user, { headers });
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

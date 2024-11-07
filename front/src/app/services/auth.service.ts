import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl

  register(userData: any): Observable<any>{
    return this.http.post(`${this.url}/registro`, userData)
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/login`, { email, password }).pipe(
      catchError(error => {
        if (error.status === 401) {
          throw new Error('Email o contraseña incorrectos');
        }
        throw new Error('Error desconocido');
      })
    );
  }

  getUserByToken(tokenObject: string | null): Observable<Usuario | undefined> {
    if (!tokenObject) {
      return of(undefined);
    }
  
    const headers = new HttpHeaders({
      'x-token': tokenObject
    });
  
    return this.http.get<Usuario>(`${this.url}/userToken`, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error al obtener el usuario:', error);
        return of(undefined);
      })
    );
  }  
}
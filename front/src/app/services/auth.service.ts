import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private userService: UserService) { }
  url = environment.baseUrl
  userUrl = environment.usersUrl;

  register(userData: any): Observable<any>{
    return this.http.post(`${this.url}/registro`, userData)
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.url}/login`, { email, password }).pipe(
        map(response => {
            const token = response.token; // Asegúrate de que el servidor envía este campo
            if (token) {
                localStorage.setItem('user', JSON.stringify({ token }));
                console.log('Token guardado en localStorage:', token);
            } else {
                console.error('Token no encontrado en la respuesta');
            }
            return token;
        }),
        catchError(error => {
            if (error.status === 401) {
                return throwError(() => new Error('Email o contraseña incorrectos'));
            }
            return throwError(() => new Error('Error desconocido'));
        })
    );
}

  getUserByToken(tokenObject: string | null): Observable<Usuario | undefined> {
    console.log('token', tokenObject);
    if (tokenObject !== null && tokenObject !== undefined) {
      let parsedTokenObject;
      try {
        parsedTokenObject = JSON.parse(tokenObject);
      } catch (error) {
        return of(undefined);
      }

      if ('token' in parsedTokenObject) {
        const token = parsedTokenObject.token;
        console.log(token)
        const headers = new HttpHeaders({
          'x-token': token
        });

        return this.http.get<Usuario>(`${this.url}` + `${this.userUrl}`+ `/Token`, { headers, withCredentials: true }).pipe(
          catchError((error: any) => {
            console.error('Error al obtener el usuario:', error);
            return throwError(() => new Error('Error al obtener el usuario'));
          }),
          switchMap((user: Usuario | undefined) => {
            if (!user) {
              throw new Error('User not found');
            }

            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.uid;
            console.log(userId)
            return this.userService.getUserById(userId); 
          }),
          catchError((error: any) => {
            console.error('Error al obtener el usuario por ID:', error);
            return of(undefined);
          })
        );
      } else {
        return of(undefined);
      }
    } else {
      return of(undefined);
    }
  }

  //Revisar todas a partir de aca
  isLoggedIn(): boolean{
    const user = this.getCurrentUser();
    return user !== null;
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getRolesOfToken(): any {
    try {
      let token = JSON.parse(localStorage.getItem('user') as string).token.split('.')[1];
      const rolesOfToken = JSON.parse(atob(token)).roles || [];
      return rolesOfToken;
    } catch (error){
      return null;
    }
  }

  isAdmin(): Observable<boolean> {
    let token = localStorage.getItem('user');
    if (!token) {
       return throwError(() => new Error('No se encontró token'));
    }
   
    try {
       const decodedToken = JSON.parse(atob(token.split('.')[1]));
       const userId = decodedToken.uid;
  
   
       return this.userService.getUserById(userId).pipe(
         map((user: Usuario | undefined) => {
           if (!user) {
             throw new Error('User not found');
           }

           const isAdmin = user.Rol?.some(role => role.nombre === 'administrador');
           if (isAdmin) {
             console.log('El usuario es administrador');
             return true;
           } else {
             console.log('El usuario no es administrador');
             return false;
           }
         }),
         catchError((error: any) => {
           console.error('Error al obtener los detalles del usuario', error);
           return throwError(() => new Error('Error al obtener los detalles del usuario'));
         }),
       );
    } catch (error: any) {
       console.error('Error al decodificar el token', error);
       return throwError(() => new Error('Error al decodificar el token'));
    }
  }
}
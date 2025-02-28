import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rol } from '../interfaces/usuario';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }

  url = environment.baseUrl
  rolesUrl = environment.rolesUrl

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.url}` + `${this.rolesUrl}`);
  }

  getRolesById(rolId: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}` + `${this.rolesUrl}` + `/${rolId}`);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReproduccionesService {
  private url = environment.baseUrl
  private reproduccionesUrl = environment.reproduccionesUrl

  constructor(private http: HttpClient) { }

  createUpdateReproduccion(usuarioId: number, entidadId: number, entidad_tipo: string) {
    const body = {
      usuario_id: usuarioId,
      entidad_id: entidadId,
      entidad_tipo: entidad_tipo
    }

    return this.http.post(`${this.url}${this.reproduccionesUrl}`, body)
  }

  getTopReproducciones(limit: number): Observable<any> {
    return this.http.get<any>(`${this.url}${this.reproduccionesUrl}/top?limit=${limit}`);
  }
}

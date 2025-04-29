import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { IUsuario } from '../interfaces/IUsuario.interface.js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly url = environment.usuarioUrl;

  constructor(private http: HttpClient) {}

  selfUpdate(
    email: string,
    telefono: string,
    contrasena: string,
    contrasena_anterior?: string
  ): Observable<ApiResponse<IUsuario>> {
    return this.http.patch<ApiResponse<IUsuario>>(`${this.url}/me`, {
      email,
      telefono,
      contrasena,
      contrasena_anterior,
    });
  }
}

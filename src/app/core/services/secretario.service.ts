import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { ISecretario } from '../interfaces/ISecretario.interface.js';
import { ICrudService } from '../interfaces/ICrudService.interface.js';

export interface ISecretarioCreate {
  //TODO: verificar los datos del secretario
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipo_doc: string;
  nro_doc: string;
  turno_trabajo: string;
}

@Injectable({
  providedIn: 'root',
})
export class SecreatarioService
  implements ICrudService<ISecretario, ISecretarioCreate>
{
  private readonly url = environment.secretariosUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<ISecretario[]>> {
    return this.http.get<ApiResponse<ISecretario[]>>(this.url);
  }

  getById(id: string): Observable<ApiResponse<ISecretario>> {
    return this.http.get<ApiResponse<ISecretario>>(`${this.url}/${id}`);
  }
  create(abogado: ISecretarioCreate): Observable<ApiResponse<ISecretario>> {
    return this.http.post<ApiResponse<ISecretario>>(this.url, abogado);
  }

  update(
    id: string,
    abogado: ISecretarioCreate
  ): Observable<ApiResponse<ISecretario>> {
    return this.http.put<ApiResponse<ISecretario>>(
      `${this.url}/${id}`,
      abogado
    );
  }

  deactivate(id: string): Observable<ApiResponse<ISecretario>> {
    return this.http.patch<ApiResponse<ISecretario>>(
      `${this.url}/deactivate/${id}`,
      {}
    );
  }
}

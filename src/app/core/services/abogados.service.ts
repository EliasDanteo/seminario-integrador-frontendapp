import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface.js';
import { IAbogado } from '../interfaces/IAbogado.interface.js';
import { ICrudService } from './crud-service.interface.js';

export interface IAbogadoCreate {
  //TODO: verificar los datos del cliente
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipo_doc: string;
  nro_doc: string;
  matricula: string;
  foto?: Blob | { type: string; data: number[] };
  especialidades?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AbogadoService implements ICrudService<IAbogado, IAbogadoCreate> {
  private readonly url = environment.abogadosUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<IAbogado[]>> {
    return this.http.get<ApiResponse<IAbogado[]>>(this.url);
  }

  getById(id: string): Observable<ApiResponse<IAbogado>> {
    return this.http.get<ApiResponse<IAbogado>>(`${this.url}/${id}`);
  }
  create(abogado: IAbogadoCreate): Observable<ApiResponse<IAbogado>> {
    return this.http.post<ApiResponse<IAbogado>>(this.url, abogado);
  }

  update(
    id: string,
    abogado: IAbogadoCreate
  ): Observable<ApiResponse<IAbogado>> {
    return this.http.put<ApiResponse<IAbogado>>(`${this.url}/${id}`, abogado);
  }

  delete(id: string): Observable<ApiResponse<IAbogado>> {
    return this.http.delete<ApiResponse<IAbogado>>(`${this.url}/${id}`);
  }
}

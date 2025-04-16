import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApi-response.interface.js';
import IAbogado from '../interfaces/IAbogado.interface.js';

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
export class AbogadoService {
  private readonly url = environment.abogadosUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<IAbogado[]>> {
    return this.http.get<ApiResponse<IAbogado[]>>(this.url);
  }

  getById(id: number): Observable<ApiResponse<IAbogado>> {
    return this.http.get<ApiResponse<IAbogado>>(`${this.url}/${id}`);
  }
  create(abogado: IAbogadoCreate): Observable<ApiResponse<IAbogado>> {
    return this.http.post<ApiResponse<IAbogado>>(this.url, abogado);
  }

  update(
    id: number,
    abogado: IAbogadoCreate
  ): Observable<ApiResponse<IAbogado>> {
    return this.http.put<ApiResponse<IAbogado>>(`${this.url}/${id}`, abogado);
  }

  delete(id: number): Observable<ApiResponse<IAbogado>> {
    return this.http.delete<ApiResponse<IAbogado>>(`${this.url}/${id}`);
  }
}

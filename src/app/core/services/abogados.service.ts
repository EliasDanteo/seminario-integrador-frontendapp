import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { IAbogado } from '../interfaces/IAbogado.interface.js';
import { ICrudService } from '../interfaces/ICrudService.interface.js';
import { IEspecialidad } from '../interfaces/IEspecialidad.interface.js';

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

  getAvailable(): Observable<ApiResponse<IAbogado[]>> {
    return this.http.get<ApiResponse<IAbogado[]>>(`${this.url}/disponibles`);
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

  deactivate(id: string): Observable<ApiResponse<IAbogado>> {
    return this.http.patch<ApiResponse<IAbogado>>(
      `${this.url}/deactivate/${id}`,
      {}
    );
  }
  findEspecialidad(id: string): Observable<ApiResponse<IEspecialidad>> {
    return this.http.get<ApiResponse<IEspecialidad>>(
      `${environment.abogadosUrl}/${id}/especialidades`
    );
  }
}

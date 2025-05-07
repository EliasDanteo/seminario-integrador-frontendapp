import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { ICaso, IFinalizarCaso } from '../interfaces/ICaso.interface.js';
import { environment } from '../../../environments/environment.js';
import { IAbogadoCaso } from '../interfaces/IAbogadoCaso.interface.js';

export interface ICasoCreate {
  id_cliente: number;
  id_abogado_principal: number;
  id_especialidad: number;
  descripcion: string;
}

@Injectable({
  providedIn: 'root',
})
export class CasosService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ApiResponse<ICaso[]>> {
    return this.httpClient.get<ApiResponse<ICaso[]>>(
      `${environment.casosUrl}/`
    );
  }

  getOne(id: string): Observable<ApiResponse<ICaso>> {
    return this.httpClient.get<ApiResponse<ICaso>>(
      `${environment.casosUrl}/${id}`
    );
  }

  getCasosAbogado(): Observable<ApiResponse<ICaso[]>> {
    return this.httpClient.get<ApiResponse<ICaso[]>>(
      `${environment.casosUrl}/encurso/`
    );
  }

  getCasosCliente(id: string): Observable<ApiResponse<ICaso[]>> {
    return this.httpClient.get<ApiResponse<ICaso[]>>(
      `${environment.casosUrl}/cliente/${id}`
    );
  }

  getAbogadosEnCaso(id_caso: number): Observable<ApiResponse<IAbogadoCaso[]>> {
    return this.httpClient.get<ApiResponse<IAbogadoCaso[]>>(
      `${environment.casosUrl}/${id_caso}/abogados`
    );
  }

  create(caso: ICasoCreate): Observable<ApiResponse<ICaso>> {
    return this.httpClient.post<ApiResponse<ICaso>>(
      `${environment.casosUrl}`,
      caso
    );
  }

  update(caso: ICasoCreate, id: number): Observable<ApiResponse<ICaso>> {
    return this.httpClient.put<ApiResponse<ICaso>>(
      `${environment.casosUrl}/${id}`,
      caso
    );
  }

  finalizarCaso(
    id_caso: number,
    plan_pago: IFinalizarCaso
  ): Observable<ApiResponse<ICaso>> {
    return this.httpClient.patch<ApiResponse<ICaso>>(
      `${environment.casosUrl}/${id_caso}/finalizar`,
      plan_pago
    );
  }

  delete(id: number): Observable<ApiResponse<ICaso>> {
    return this.httpClient.patch<ApiResponse<ICaso>>(
      `${environment.casosUrl}/${id}/cancelar`,
      {}
    );
  }

  desvincularAbogado(
    id_abogado_caso: number
  ): Observable<ApiResponse<IAbogadoCaso>> {
    return this.httpClient.patch<ApiResponse<IAbogadoCaso>>(
      `${environment.casosUrl}/abogados-casos/${id_abogado_caso}/desvincular`,
      {}
    );
  }

  vincularAbogado(data: any): Observable<ApiResponse<IAbogadoCaso>> {
    return this.httpClient.post<ApiResponse<IAbogadoCaso>>(
      `${environment.casosUrl}/abogados-casos/`,
      data
    );
  }
}

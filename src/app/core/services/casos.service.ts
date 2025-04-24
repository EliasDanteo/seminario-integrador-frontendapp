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

  getAbogadosEnCaso(id_caso: number): Observable<ApiResponse<IAbogadoCaso[]>> {
    return this.httpClient.get<ApiResponse<IAbogadoCaso[]>>(
      `${environment.casosUrl}/${id_caso}/abogados`
    );
  }

  delete(id: number): Observable<ApiResponse<ICaso>> {
    return this.httpClient.patch<ApiResponse<ICaso>>(
      `${environment.casosUrl}/${id}/cancelar`,
      {}
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
}

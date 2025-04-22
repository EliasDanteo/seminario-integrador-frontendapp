import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { ICuota } from '../interfaces/ICuota.interface.js';
import { Observable } from 'rxjs';

export interface ICuotaCreate {
  forma_cobro: string;
}

@Injectable({
  providedIn: 'root',
})
export class CuotasCasoService {
  constructor(private httpClient: HttpClient) {}

  getAllByCaso(caso_id: number): Observable<ApiResponse<ICuota[]>> {
    return this.httpClient.get<ApiResponse<ICuota[]>>(
      `${environment.casosUrl}/${caso_id}/cuotas`
    );
  }

  getNextFee(caso_id: number): Observable<ApiResponse<ICuota>> {
    return this.httpClient.get<ApiResponse<ICuota>>(
      `${environment.casosUrl}/${caso_id}/cuotas/siguiente`
    );
  }

  createFee(
    cuota: ICuotaCreate,
    caso_id: number,
    numero_cuota: number
  ): Observable<ApiResponse<ICuota>> {
    return this.httpClient.patch<ApiResponse<ICuota>>(
      `${environment.casosUrl}/${caso_id}/cuotas/${numero_cuota}`,
      cuota
    );
  }

  deleteFee(caso_id: number): Observable<ApiResponse<ICuota>> {
    return this.httpClient.patch<ApiResponse<ICuota>>(
      `${environment.casosUrl}/${caso_id}/cuotas/cancelar`,
      {}
    );
  }
}

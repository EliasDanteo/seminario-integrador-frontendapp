import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { environment } from '../../../environments/environment.js';
import { IActividadRealizada } from '../interfaces/IActividad-realizada.interface.js';

@Injectable({
  providedIn: 'root',
})
export class ActividadesAbogadoService {
  constructor(private httpClient: HttpClient) {}

  getActividadesAbogado(
    id_abogado: number
  ): Observable<ApiResponse<IActividadRealizada[]>> {
    return this.httpClient.get<ApiResponse<IActividadRealizada[]>>(
      `${environment.actividadesUrl}/realizadas/${id_abogado}` // Cambiar el ID
    );
  }

  createActividad(
    actividad: IActividadRealizada
  ): Observable<ApiResponse<IActividadRealizada>> {
    return this.httpClient.post<ApiResponse<IActividadRealizada>>(
      `${environment.actividadesUrl}/realizadas`,
      actividad
    );
  }

  updateActividad(
    actividad: IActividadRealizada,
    id_actividad: number
  ): Observable<ApiResponse<IActividadRealizada>> {
    return this.httpClient.put<ApiResponse<IActividadRealizada>>(
      `${environment.actividadesUrl}/realizadas/${id_actividad}`,
      actividad
    );
  }

  deleteActividad(id: number): Observable<ApiResponse<void>> {
    return this.httpClient.delete<ApiResponse<void>>(
      `${environment.actividadesUrl}/realizadas/${id}`
    );
  }
}

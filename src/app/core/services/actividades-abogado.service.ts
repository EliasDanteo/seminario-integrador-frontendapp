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

  getActividadesAbogado(): Observable<ApiResponse<IActividadRealizada[]>> {
    return this.httpClient.get<ApiResponse<IActividadRealizada[]>>(
      `${environment.actividadesUrl}/realizadas/2` // Cambiar el ID
    );
  }
}

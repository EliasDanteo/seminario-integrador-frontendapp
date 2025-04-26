import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { IActividad } from '../interfaces/IActividad.interface.js';
import { environment } from '../../../environments/environment.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  constructor(private httpClient: HttpClient) {}

  getAllActividades(): Observable<ApiResponse<IActividad[]>> {
    return this.httpClient.get<ApiResponse<IActividad[]>>(
      `${environment.actividadesUrl}`
    );
  }
}

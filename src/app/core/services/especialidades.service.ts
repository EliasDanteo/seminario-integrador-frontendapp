import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { IEspecialidad } from '../interfaces/IEspecialidad.interface.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadesService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ApiResponse<IEspecialidad[]>> {
    return this.httpClient.get<ApiResponse<IEspecialidad[]>>(
      `${environment.especialidadesUrl}`
    );
  }

  getByAbogado(id: number): Observable<ApiResponse<IEspecialidad[]>> {
    return this.httpClient.get<ApiResponse<IEspecialidad[]>>(
      `${environment.especialidadesUrl}/abogado/${id}`
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';

@Injectable({
  providedIn: 'root',
})
export class InformesService {
  constructor(private httpClient: HttpClient) {}

  solicitarInformeIngresos(mes: string): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${environment.informesUrl}`,
      { mes: mes }
    );
  }
}

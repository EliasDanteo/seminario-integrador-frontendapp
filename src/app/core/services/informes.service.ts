import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { IInforme } from '../interfaces/IInforme.interface.js';

@Injectable({
  providedIn: 'root',
})
export class InformesService {
  constructor(private httpClient: HttpClient) {}

  solicitarInformeIngresos(informe: IInforme): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${environment.informesUrl}/ingresos`,
      informe
    );
  }

  solicitarInformeDesempenio(informe: IInforme): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${environment.informesUrl}/desempenio`,
      informe
    );
  }

  solicitarInformeCaso(id_caso: number): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${environment.informesUrl}/caso`,
      { caso: id_caso }
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  constructor(private http: HttpClient) {}

  private readonly url =
    environment.apiUrl + '/usuarios/restablecer-contrasena';

  sendResetLink(email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.url, { email: email });
  }

  resetPassword(code: string, newPassword: string) {
    return this.http.post(`${environment.apiUrl}/reseteo-clave/${code}`, {
      nueva_contrasena: newPassword,
      confirmar_contrasena: newPassword,
    });
  }
}

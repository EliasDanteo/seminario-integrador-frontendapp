import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { SnackbarService } from './snackbar.service.js';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { ICliente } from '../interfaces/ICliente.interface.js';
import { IAbogado } from '../interfaces/IAbogado.interface.js';
import { ISecretario } from '../interfaces/ISecretario.interface.js';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { environment } from '../../../environments/environment.js';

export interface ILogin {
  email: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userSignal = signal<ICliente | IAbogado | ISecretario | null>(null);

  constructor(
    private http: HttpClient,
    private snackBarService: SnackbarService
  ) {
    console.log(this.userSignal);
  }

  login(
    user: ILogin
  ): Observable<ApiResponse<ICliente | IAbogado | ISecretario>> {
    return this.http
      .post<ApiResponse<ICliente | IAbogado | ISecretario>>(
        environment.authUrl,
        user
      )
      .pipe(
        tap((response: ApiResponse<ICliente | IAbogado | ISecretario>) => {
          sessionStorage.setItem(
            'user',
            JSON.stringify({
              ...response.data,
            })
          );

          this.userSignal.set({
            ...response.data,
          });
        })
      );
  }

  async logout(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.authUrl}/logout/`, {})
      );

      this.clearUserSession();
      return true;
    } catch (error) {
      this.snackBarService.showError('No se pudo cerrar la sesión');
      return false;
    }
  }

  clearUserSession(): void {
    this.userSignal.set(null);
    sessionStorage.removeItem('user');
  }

  getUser(): ICliente | IAbogado | ISecretario | null {
    const user = sessionStorage.getItem('user');

    if (user !== null) {
      const parsed = JSON.parse(user);
      this.userSignal.set(parsed);
      console.log('Parsed user:', parsed);
      return parsed;
    }

    this.userSignal.set(null);
    return null;
  }
}

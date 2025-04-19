import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { IHorarioTurno } from '../interfaces/IHorarioTurno.interface.js';
import { IAbogado } from '../interfaces/IAbogado.interface.js';

export interface IHorarioTurnoCreate {
  hora_inicio: string;
  hora_fin: string;
  dia_semana: number;
  abogado: Pick<IAbogado, 'id'>;
}

@Injectable({
  providedIn: 'root',
})
export class HorarioTurnoService {
  constructor(private http: HttpClient) {}

  private readonly url = environment.turnosUrl + '/horarios';

  getDisponibles(
    fecha: string,
    idAbogado?: string
  ): Observable<ApiResponse<IHorarioTurno[]>> {
    let params = new HttpParams().set('fecha', fecha);

    if (fecha) {
      params = params.set('fecha', fecha);
    }

    if (idAbogado) {
      params = params.set('id_abogado', idAbogado);
    }
    return this.http.get<ApiResponse<IHorarioTurno[]>>(
      `${this.url}/disponibles`,
      { params }
    );
  }

  getAll(): Observable<ApiResponse<IHorarioTurno[]>> {
    return this.http.get<ApiResponse<IHorarioTurno[]>>(this.url);
  }

  create(
    horarioTurno: IHorarioTurnoCreate
  ): Observable<ApiResponse<IHorarioTurno>> {
    return this.http.post<ApiResponse<IHorarioTurno>>(this.url, horarioTurno);
  }

  update(id: string): Observable<ApiResponse<IHorarioTurno>> {
    return this.http.put<ApiResponse<IHorarioTurno>>(`${this.url}/${id}`, {});
  }

  deactivate(id: string): Observable<ApiResponse<IHorarioTurno>> {
    return this.http.patch<ApiResponse<IHorarioTurno>>(
      `${this.url}/deactivate/${id}`,
      {}
    );
  }
}

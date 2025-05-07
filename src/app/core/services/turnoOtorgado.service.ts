import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { IHorarioTurno } from '../interfaces/IHorarioTurno.interface.js';
import { ITurnoOtorgado } from '../interfaces/ITurnoOtorgado.interface.js';

export interface ITurnoOtorgadoCreate {
  id_horario_turno: string;
  fecha_turno: string;
  // se envia id_cliente o si es visitante nombre, telefono y email
  id_cliente?: string;
  nombre?: string;
  telefono?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class turnoOtorgadoService {
  constructor(private http: HttpClient) {}

  private readonly url = environment.turnosUrl;
  //TURNOS OTORGADOS
  findByAbogado(id_abogado: string): Observable<ApiResponse<ITurnoOtorgado[]>> {
    return this.http.get<ApiResponse<ITurnoOtorgado[]>>(
      `${this.url}/${id_abogado}`
    );
  }

  create(
    turnoOtorgado: ITurnoOtorgadoCreate
  ): Observable<ApiResponse<IHorarioTurno>> {
    return this.http.post<ApiResponse<IHorarioTurno>>(
      `${this.url}`,
      turnoOtorgado
    );
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { ICliente } from '../interfaces/ICliente.interface.js';
import { ICrudService } from '../interfaces/ICrudService.interface.js';

export interface IClienteCreate {
  //TODO: verificar los datos del cliente
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipo_doc: string;
  nro_doc: string;
  es_empresa: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ClienteService implements ICrudService<ICliente, IClienteCreate> {
  private readonly url = environment.clientesUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<ICliente[]>> {
    return this.http.get<ApiResponse<ICliente[]>>(this.url);
  }

  getById(id: string): Observable<ApiResponse<ICliente>> {
    return this.http.get<ApiResponse<ICliente>>(`${this.url}/${id}`);
  }
  create(cliente: IClienteCreate): Observable<ApiResponse<ICliente>> {
    return this.http.post<ApiResponse<ICliente>>(this.url, cliente);
  }

  update(
    id: string,
    cliente: IClienteCreate
  ): Observable<ApiResponse<ICliente>> {
    return this.http.put<ApiResponse<ICliente>>(`${this.url}/${id}`, cliente);
  }

  deactivate(id: string): Observable<ApiResponse<ICliente>> {
    return this.http.delete<ApiResponse<ICliente>>(
      `${this.url}/deactivate/${id}`,
      {}
    );
  }
}

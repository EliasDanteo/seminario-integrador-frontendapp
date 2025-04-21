import { ApiResponse } from './IApiResponse.interface.js';
import { Observable } from 'rxjs';

export interface ICrudService<T, T2> {
  getAll(): Observable<ApiResponse<T[]>>;
  getById(id: string): Observable<ApiResponse<T>>;
  create(item: T2): Observable<ApiResponse<T>>;
  update(id: string, item: T2): Observable<ApiResponse<T>>;
  deactivate(id: string): Observable<ApiResponse<T>>;
}

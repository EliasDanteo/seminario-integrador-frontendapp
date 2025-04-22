import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.js';
import { IJUS } from '../interfaces/IJUS.interface.js';
import { ApiResponse } from '../interfaces/IApiResponse.interface.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JusService {
  constructor(private httpClient: HttpClient) {}

  getJusPrice(): Observable<ApiResponse<IJUS>> {
    return this.httpClient.get<ApiResponse<IJUS>>(
      `${environment.jusUrl}/latest`
    );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CompraDTOResponse } from '../models/compra.model';
import { KeycloakService } from './keycloak.service';

@Injectable({ providedIn: 'root' })
export class ComprasService {
  private readonly http = inject(HttpClient);
  private readonly keycloak = inject(KeycloakService);

  private headers(): HttpHeaders {
    const token = this.keycloak.getAuthorizationHeader();
    return token
      ? new HttpHeaders({ Authorization: token })
      : new HttpHeaders();
  }

  minhasCompras(page = 0, pageSize = 10): Observable<CompraDTOResponse[]> {
    return this.http.get<CompraDTOResponse[]>(
      `/compras/me?page=${page}&pageSize=${pageSize}`,
      { headers: this.headers() }
    );
  }

  buscarPorId(id: number): Observable<CompraDTOResponse> {
    return this.http.get<CompraDTOResponse>(`/compras/${id}`, {
      headers: this.headers(),
    });
  }
}

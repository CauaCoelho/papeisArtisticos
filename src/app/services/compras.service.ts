import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { CompraDTOResponse, ItemCompra } from '../models/compra.model';
import { KeycloakService } from './keycloak.service';

@Injectable({ providedIn: 'root' })
export class ComprasService {
  private readonly http = inject(HttpClient);
  private readonly keycloak = inject(KeycloakService);
  private readonly LOCAL_COMPRAS_KEY = 'compras_local';

  private getLocalStorageKey(): string {
    const usuarioId = this.keycloak.userId();
    if (usuarioId) {
      return `${this.LOCAL_COMPRAS_KEY}_${usuarioId}`;
    }

    const email = this.keycloak.email();
    if (email) {
      return `${this.LOCAL_COMPRAS_KEY}_${email}`;
    }

    const usuario = this.keycloak.nomeUsuario();
    return usuario ? `${this.LOCAL_COMPRAS_KEY}_${usuario}` : this.LOCAL_COMPRAS_KEY;
  }

  private headers(): HttpHeaders {
    const token = this.keycloak.getAuthorizationHeader();
    return token
      ? new HttpHeaders({ Authorization: token })
      : new HttpHeaders();
  }

  minhasCompras(page = 0, pageSize = 10): Observable<CompraDTOResponse[]> {
    return this.http.get<any>(
      `/compras/me?page=${page}&pageSize=${pageSize}`,
      { headers: this.headers() }
    ).pipe(
      map(res => {
        const apiCompras = res?.data || [];
        return [...this.carregarComprasLocais(), ...apiCompras]
          .sort((a, b) => new Date(b.dataCompra || '').getTime() - new Date(a.dataCompra || '').getTime());
      }),
      catchError(() => of(this.carregarComprasLocais()))
    );
  }

  registrarCompra(compra: { itens: ItemCompra[]; total: number; status?: string }): Observable<CompraDTOResponse> {
    const payload = {
      ...compra,
      dataCompra: new Date().toISOString(),
      status: compra.status || 'Concluído'
    };

    return this.http.post<any>(`/compras`, payload, { headers: this.headers() }).pipe(
      map(res => {
        const saved: CompraDTOResponse = {
          id: res?.id ?? this.nextLocalId(),
          total: payload.total,
          dataCompra: res?.dataCompra ?? payload.dataCompra,
          status: res?.status ?? payload.status,
          itens: payload.itens,
          enderecoEntrega: res?.enderecoEntrega
        };
        this.saveLocalCompra(saved);
        return saved;
      }),
      catchError(() => {
        const fallback: CompraDTOResponse = {
          id: this.nextLocalId(),
          total: payload.total,
          dataCompra: payload.dataCompra,
          status: payload.status,
          itens: payload.itens
        };
        this.saveLocalCompra(fallback);
        return of(fallback);
      })
    );
  }

  buscarPorId(id: number): Observable<CompraDTOResponse> {
    return this.http.get<CompraDTOResponse>(`/compras/${id}`, {
      headers: this.headers(),
    });
  }

  private carregarComprasLocais(): CompraDTOResponse[] {
    const raw = localStorage.getItem(this.getLocalStorageKey());
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as CompraDTOResponse[];
    } catch {
      return [];
    }
  }

  private saveLocalCompra(compra: CompraDTOResponse): void {
    const compras = [compra, ...this.carregarComprasLocais()];
    localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(compras));
  }

  private nextLocalId(): number {
    return Date.now();
  }
}

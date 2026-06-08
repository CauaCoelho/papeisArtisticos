import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WishlistDTOResponse } from '../models/wishlist.model';
import { KeycloakService } from './keycloak.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly keycloak = inject(KeycloakService);

  private headers(): HttpHeaders {
    const token = this.keycloak.getAuthorizationHeader();
    return token
      ? new HttpHeaders({ Authorization: token })
      : new HttpHeaders();
  }

  listar(): Observable<WishlistDTOResponse[]> {
    return this.http.get<WishlistDTOResponse[]>('/wishlist', {
      headers: this.headers(),
    });
  }

  adicionar(produtoId: number): Observable<WishlistDTOResponse> {
    return this.http.post<WishlistDTOResponse>(`/wishlist/${produtoId}`, null, {
      headers: this.headers(),
    });
  }

  remover(produtoId: number): Observable<void> {
    return this.http.delete<void>(`/wishlist/${produtoId}`, {
      headers: this.headers(),
    });
  }
}

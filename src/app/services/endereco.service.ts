import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EnderecoModel, EnderecoDTO } from '../models/endereco.model';
import { KeycloakService } from './keycloak.service';

@Injectable({ providedIn: 'root' })
export class EnderecoService {
  private readonly http = inject(HttpClient);
  private readonly keycloak = inject(KeycloakService);

  private headers(): HttpHeaders {
    const token = this.keycloak.getAuthorizationHeader();
    return token
      ? new HttpHeaders({ Authorization: token })
      : new HttpHeaders();
  }

  meusPorUsuario(usuarioId: number): Observable<EnderecoModel[]> {
    return this.http.get<EnderecoModel[]>(`/usuarios/${usuarioId}/enderecos`, {
      headers: this.headers(),
    });
  }

  criar(dto: EnderecoDTO): Observable<EnderecoModel> {
    return this.http.post<EnderecoModel>('/enderecos', dto, {
      headers: this.headers(),
    });
  }

  atualizar(id: number, dto: EnderecoDTO): Observable<void> {
    return this.http.put<void>(`/enderecos/${id}`, dto, {
      headers: this.headers(),
    });
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`/enderecos/${id}`, {
      headers: this.headers(),
    });
  }
}

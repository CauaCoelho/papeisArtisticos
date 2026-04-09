import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bloco } from '../models/bloco.model';

@Injectable({
  providedIn: 'root',
})
export class BlocoService {
  private readonly api = 'http://localhost:8080/blocos';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<Bloco[]> {
    const params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params.page = page.toString();
      params.pageSize = pageSize.toString();
    }

    return this.httpClient.get<Bloco[]>(this.api, { params });
  }

  findByNome(nome: string): Observable<Bloco[]> {
    return this.httpClient.get<Bloco[]>(`${this.api}/search?nome=${nome}`);
  }

  findById(id: any): Observable<Bloco> {
    return this.httpClient.get<Bloco>(`${this.api}/${id}`);
  }

  create(bloco: Bloco): Observable<Bloco> {
    return this.httpClient.post<Bloco>(this.api, bloco);
  }

  update(bloco: Bloco): Observable<Bloco> {
    if (!bloco.id) {
      throw new Error('Bloco precisa de ID para atualização.');
    }
    return this.httpClient.put<Bloco>(`${this.api}/${bloco.id}`, bloco);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/${id}`);
  }

  count(): Observable<any> {
    return this.httpClient.get<any>(`${this.api}/count`);
  }
}

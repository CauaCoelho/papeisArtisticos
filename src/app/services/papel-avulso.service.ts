import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PapelAvulso } from '../models/papel-avulso.model';

@Injectable({
  providedIn: 'root',
})
export class PapelAvulsoService {
  private readonly api = '/papelavulsos';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<PapelAvulso[]> {
    const params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params.page = page.toString();
      params.pageSize = pageSize.toString();
    }

    return this.httpClient.get<PapelAvulso[]>(this.api, { params });
  }

  findByNome(nome: string): Observable<PapelAvulso[]> {
    return this.httpClient.get<PapelAvulso[]>(`${this.api}/search?nome=${nome}`);
  }

  findById(id: any): Observable<PapelAvulso> {
    return this.httpClient.get<PapelAvulso>(`${this.api}/${id}`);
  }

  create(papel: PapelAvulso): Observable<PapelAvulso> {
    return this.httpClient.post<PapelAvulso>(this.api, papel);
  }

  update(papel: PapelAvulso): Observable<PapelAvulso> {
    if (!papel.id) {
      throw new Error('PapelAvulso precisa de ID para atualização.');
    }
    return this.httpClient.put<PapelAvulso>(`${this.api}/${papel.id}`, papel);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/${id}`);
  }

  count(): Observable<any> {
    return this.httpClient.get<any>(`${this.api}/count`);
  }
}

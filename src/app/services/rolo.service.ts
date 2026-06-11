import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rolo } from '../models/rolo.model';

@Injectable({
  providedIn: 'root',
})
export class RoloService {
  private readonly api = '/rolos';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<any> {
    const params: any = {};
    if (page !== undefined && pageSize !== undefined) {
      params.page = page.toString();
      params.pageSize = pageSize.toString();
    }
    return this.httpClient.get<any>(this.api, { params });
  }

  findById(id: any): Observable<Rolo> {
    return this.httpClient.get<Rolo>(`${this.api}/${id}`);
  }

  count(): Observable<any> {
    return this.httpClient.get<any>(`${this.api}/count`);
  }
}

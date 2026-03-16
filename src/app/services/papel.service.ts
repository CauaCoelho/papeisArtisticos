import { Injectable } from '@angular/core';
import { Papel } from '../models/papel.model';
import { Formato } from '../enums/formato.enum';
import { Textura } from '../enums/textura.enum';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PapelService {

  private readonly apiUrl = 'http://localhost:8080/papeis';
  constructor(private http: HttpClient) {}
  
  findAllPapeis(): Observable<Papel[]> {
    return this.http.get<Papel[]>(this.apiUrl);
  }

  findById(id: number): Observable<Papel> {
    return this.http.get<Papel>(`${this.apiUrl}/${id}`);
  }

  createPapel(papel: Papel): Observable<Papel> {
    return this.http.post<Papel>(this.apiUrl, papel);
  }

  updatePapel(id: number, papel: Papel): Observable<Papel> {
    return this.http.put<Papel>(`${this.apiUrl}/${id}`, papel);
  }

  deletePapel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

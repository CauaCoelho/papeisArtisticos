import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca.model';

@Injectable({ providedIn: 'root' })
export class MarcaService {
    private readonly api = '/marcas';
    constructor(private http: HttpClient) { }

    findAll(): Observable<Marca[]> {
        return this.http.get<Marca[]>(this.api);
    }
    findById(id: number): Observable<Marca> {
        return this.http.get<Marca>(`${this.api}/${id}`);
    }
    create(marca: Marca): Observable<Marca> {
        return this.http.post<Marca>(this.api, marca);
    }
    update(marca: Marca): Observable<Marca> {
        return this.http.put<Marca>(`${this.api}/${marca.id}`, marca);
    }
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/${id}`);
    }
}
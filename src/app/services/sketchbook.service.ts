import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Sketchbook } from "../models/sketchbook.model";
import { PageResponse } from "../models/page-response.class";

@Injectable({
  providedIn: 'root'
})
export class SketchbookService {

  
  private readonly api = 'http://localhost:8080/sketchbooks';

  constructor(
    private httpClient: HttpClient,
  ) { }

  findAll(page: number, pageSize: number): Observable<PageResponse<Sketchbook>> {
  return this.httpClient.get<PageResponse<Sketchbook>>(
    `${this.api}?page=${page}&pageSize=${pageSize}`
  );
}

  findByNome(nome: string): Observable<Sketchbook[]> {
    return this.httpClient.get<Sketchbook[]>(`${this.api}/search?nome=${nome}`);
  }

  findById(id: any): Observable<Sketchbook> {
    // O mesmo que (this.api + "/" + id)
    return this.httpClient.get<Sketchbook>(`${this.api}/${id}`);
  }

  create(sketchbook: Sketchbook): Observable<Sketchbook> {
    return this.httpClient.post<Sketchbook>(this.api, sketchbook);
  }

  update(sketchbook: Sketchbook): Observable<Sketchbook> {
    if (!sketchbook.id) {
      throw new Error('Sketchbook precisa de ID para atualização.');
    }
    else {

      return this.httpClient.put<Sketchbook>(`${this.api}/${sketchbook.id}`, sketchbook);

    }

  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/${id}`);
  }

  count(): Observable<any>{
    return this.httpClient.get<any>(`${this.api}/count`)
  }
    
}

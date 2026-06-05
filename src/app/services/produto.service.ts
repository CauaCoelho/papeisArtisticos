import { Injectable } from '@angular/core';
import { Produto } from '../models/produto.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {

  private readonly apiUrl = 'http://localhost:8080/papeis';
  constructor(private http: HttpClient) { }

  findAllProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}?_t=${new Date().getTime()}`);
  }

  findById(id: any): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  createProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  updateProduto(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  uploadImagem(idProduto: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('idProduto', String(idProduto));
    formData.append('file', file);

    return this.http.patch<void>(`${this.apiUrl}/image/upload`, formData);
  }
}

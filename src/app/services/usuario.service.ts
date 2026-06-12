import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';
import { Usuario } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/usuarios').pipe(
      catchError((err) => {
        console.error('Erro ao carregar usuários:', err);
        return of([]);
      })
    );
  }
}

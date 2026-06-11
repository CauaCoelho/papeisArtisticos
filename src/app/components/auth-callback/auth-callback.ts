import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../services/keycloak.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-card">
        @if (erro) {
          <div class="erro">
            <span class="material-symbols-outlined">error</span>
            <h2>Erro ao autenticar</h2>
            <p>{{ erro }}</p>
            <button class="btn-voltar" (click)="voltarHome()">Voltar ao início</button>
          </div>
        } @else {
          <div class="carregando">
            <div class="spinner"></div>
            <p>Autenticando, aguarde...</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      font-family: 'Inter', sans-serif;
    }
    .callback-card {
      background: white;
      border-radius: 24px;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 25px 50px rgba(0,0,0,0.3);
      min-width: 340px;
    }
    .carregando p { color: #64748b; margin-top: 1.5rem; font-size: 1.1rem; }
    .spinner {
      width: 48px; height: 48px;
      border: 4px solid #e2e8f0;
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .erro .material-symbols-outlined { font-size: 3rem; color: #ef4444; }
    .erro h2 { color: #0f172a; margin: 1rem 0 0.5rem; }
    .erro p { color: #64748b; margin-bottom: 1.5rem; }
    .btn-voltar {
      background: #0f172a; color: white; border: none;
      padding: 0.75rem 2rem; border-radius: 12px;
      cursor: pointer; font-size: 1rem;
      transition: background 0.2s;
    }
    .btn-voltar:hover { background: #38bdf8; }
  `]
})
export class AuthCallback implements OnInit {
  erro: string | null = null;

  constructor(
    private keycloak: KeycloakService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    console.log('AuthCallback iniciado');

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const errorParam = params.get('error');
    console.log('Code recebido:', code);

    if (errorParam) {
      this.erro = params.get('error_description') ?? 'Autenticação recusada pelo Keycloak.';
      return;
    }

    if (!code) {
      this.erro = 'Código de autorização não encontrado na URL.';
      return;
    }

    try {
      await this.keycloak.exchangeCodeForToken(code);
      // Redireciona para o perfil após login bem-sucedido
      await this.router.navigate(['/perfil']);
    } catch (e: any) {
      this.erro = e?.message ?? 'Erro desconhecido ao processar o login.';
    }
  }

  voltarHome(): void {
    this.router.navigate(['/home']);
  }
}

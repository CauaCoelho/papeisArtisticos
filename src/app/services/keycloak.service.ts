import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakJwtPayload, KeycloakTokenResponse } from '../models/keycloak.model';

const KEYCLOAK_SERVER = 'http://localhost:8180';
const REALM = 'papeis-artisticos';
const CLIENT_ID = 'papeis-frontend';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;
const STORAGE_KEY = 'kc-token';

@Injectable({ providedIn: 'root' })
export class KeycloakService {

  private readonly _token = signal<string | null>(this.loadToken());
  private readonly _payload = signal<KeycloakJwtPayload | null>(this.decodeStoredToken());
  private readonly _userId = signal<number | null>(null);

  /** URLs do Keycloak */
  private readonly authUrl = `${KEYCLOAK_SERVER}/realms/${REALM}/protocol/openid-connect/auth`;
  readonly tokenUrl = `${KEYCLOAK_SERVER}/realms/${REALM}/protocol/openid-connect/token`;

  /** Signals públicos */
  readonly isLoggedIn = computed(() => {
    const payload = this._payload();
    if (!payload) return false;
    // Verifica se o token ainda é válido
    return Date.now() / 1000 < payload.exp;
  });

  readonly nomeUsuario = computed(() =>
    this._payload()?.name ?? this._payload()?.preferred_username ?? null
  );

  readonly email = computed(() => this._payload()?.email ?? null);

  readonly userId = computed(() => this._userId());

  readonly roles = computed(() =>
    this._payload()?.realm_access?.roles ?? []
  );

  constructor(private router: Router) {
    if (this.isLoggedIn()) {
      this.carregarUsuarioDb();
    }
  }

  async carregarUsuarioDb(): Promise<void> {
    const token = this._token();
    if (!token) {
      this._userId.set(null);
      return;
    }
    try {
      const response = await fetch('api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const user = await response.json();
        this._userId.set(user.id);
      } else {
        this._userId.set(null);
      }
    } catch (err) {
      console.error('Erro ao carregar ID do usuario do backend:', err);
      this._userId.set(null);
    }
  }

  /** Redireciona para a tela de login do Keycloak */
async login(): Promise<void> {
  // ✅ Verifica se o Keycloak está acessível antes de redirecionar
  try {
    const probe = await fetch(
      `${KEYCLOAK_SERVER}/realms/${REALM}/.well-known/openid-configuration`,
      { method: 'HEAD', signal: AbortSignal.timeout(3000) }
    );
    if (!probe.ok) {
      console.error('[KeycloakService] Realm não encontrado:', probe.status);
      // Emita um signal de erro para o componente tratar
      throw new Error(`Realm "${REALM}" não encontrado no Keycloak (${probe.status})`);
    }
  } catch (err) {
    console.error('[KeycloakService] Keycloak inacessível:', err);
    throw err; // Componente de login deve capturar e mostrar mensagem amigável
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
  });
  window.location.href = `${this.authUrl}?${params.toString()}`;
}
  /** Encerra a sessão no Keycloak e limpa dados locais */
  logout(): void {
    const token = this._token();
    this.clearSession();

    const logoutUrl = `${KEYCLOAK_SERVER}/realms/${REALM}/protocol/openid-connect/logout`;
    const params = new URLSearchParams({
      post_logout_redirect_uri: window.location.origin,
      client_id: CLIENT_ID,
    });
    window.location.href = `${logoutUrl}?${params.toString()}`;
  }

  /** Troca o authorization code por um access token */
  async exchangeCodeForToken(code: string): Promise<void> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code,
      redirect_uri: REDIRECT_URI,
    });

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`Falha ao trocar code por token: ${response.statusText}`);
    }

    const data: KeycloakTokenResponse = await response.json();
    this.saveToken(data.access_token);
  }

  /** Retorna o Bearer token para uso nos headers HTTP */
  getAuthorizationHeader(): string | null {
    const token = this._token();
    return token ? `Bearer ${token}` : null;
  }

  /** Verifica se o usuário possui determinada role */
  hasRole(role: string): boolean {
    return this.roles().map(r => r.toUpperCase()).includes(role.toUpperCase());
  }

  /** Verifica se o usuário é ADMIN */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  // ── Privados ─────────────────────────────────────────────────────────────

  private saveToken(token: string): void {
    localStorage.setItem(STORAGE_KEY, token);
    const payload = this.decodeJwt(token);
    this._token.set(token);
    this._payload.set(payload);
    this.carregarUsuarioDb();
  }

  private clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._token.set(null);
    this._payload.set(null);
    this._userId.set(null);
  }

  private loadToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  private decodeStoredToken(): KeycloakJwtPayload | null {
    const token = this.loadToken();
    return token ? this.decodeJwt(token) : null;
  }

  /** Decodifica um JWT sem verificar assinatura (feito pelo backend) */
  private decodeJwt(token: string): KeycloakJwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      // Padding para base64
      const padded = payload + '=='.slice((payload.length % 4) || 4);
      const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as KeycloakJwtPayload;
    } catch {
      return null;
    }
  }
}

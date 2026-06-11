// auth.interceptor.ts — CORRIGIDO
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { KeycloakService } from '../services/keycloak.service';
import { EcommerceAuthService } from '../services/ecommerce-auth.service';

// ✅ Endpoints que SEMPRE exigem autenticação
const PRIVATE_ENDPOINTS = [
    '/enderecos',
    '/usuarios',
    '/wishlist',
    '/compras',
    '/auth/me',
];

// ✅ Endpoints públicos — token enviado SE disponível, mas nunca bloqueado
const PUBLIC_ENDPOINTS = [
    '/papeis',
    '/sketchbooks',
    '/blocos',
    '/marcas',
    '/perfil',
];

// ✅ Endpoints de auth — nunca recebem token de usuário
const AUTH_ENDPOINTS = [
    '/auth/login',
    '/protocol/openid-connect',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const url = req.url;

    // Requisições de login/OIDC: passam sem token
    const isAuthEndpoint = AUTH_ENDPOINTS.some(e => url.includes(e));
    if (isAuthEndpoint) {
        return next(req);
    }

    // Requisições externas não gerenciadas pelo interceptor
    const isBackendRequest =
        [...PRIVATE_ENDPOINTS, ...PUBLIC_ENDPOINTS].some(e => url.startsWith(e)) ||
        url.startsWith('http://localhost:8080');

    if (!isBackendRequest) {
        return next(req);
    }

    // Recupera token — mesma lógica de fonte única
    const authService = inject(EcommerceAuthService);
    const keycloakService = inject(KeycloakService, { optional: true });

    const authorization =
        authService.authorizationValue() ||
        keycloakService?.getAuthorizationHeader() ||
        null;

    // ✅ Endpoint PRIVADO sem token: bloqueia com erro claro
    const isPrivate = PRIVATE_ENDPOINTS.some(e => url.startsWith(e));
    if (isPrivate && !authorization) {
        console.warn(`[authInterceptor] Acesso negado (sem token): ${url}`);
        return throwError(() => ({
            status: 401,
            message: 'Usuário não autenticado. Faça login novamente.',
        }));
    }

    // ✅ Endpoint PÚBLICO sem token: deixa passar normalmente
    if (!authorization) {
        return next(req);
    }

    // ✅ Token disponível: anexa em qualquer endpoint backend
    return next(req.clone({
        setHeaders: { Authorization: authorization },
    }));
};
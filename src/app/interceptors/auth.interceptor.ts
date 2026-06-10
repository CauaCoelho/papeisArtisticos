import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EcommerceAuthService } from '../services/ecommerce-auth.service';
import { KeycloakService } from '../services/keycloak.service';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Only intercept backend API endpoints, not general relative routes (like frontend pages /auth/callback)
    const backendEndpoints = ['/auth', '/papeis', '/enderecos', '/usuarios', '/wishlist', '/compras', '/sketchbooks', '/blocos', '/marcas'];
    const isBackendRequest =
        backendEndpoints.some(endpoint => req.url.startsWith(endpoint)) ||
        req.url.startsWith('http://localhost:8080');

    // Requisições de login/OIDC não levam token de usuário
    const isLoginRequest = req.url.includes('/auth/login') || req.url.includes('/protocol/openid-connect');

    if (!isBackendRequest || isLoginRequest) {
        return next(req);
    }

    const authService = inject(EcommerceAuthService);
    const keycloakService = inject(KeycloakService, { optional: true });
    const authorization =
        authService.authorizationValue() ||
        keycloakService?.getAuthorizationHeader() ||
        null;

    if (!authorization) {
        console.warn(
            `[authInterceptor] Requisição para ${req.url} bloqueada: sem token de autenticação.`
        );

        return throwError(() => ({
            status: 401,
            message: 'Usuário não autenticado. Faça login novamente.'
        }));
    }

    // ✅ CLONE COM HEADER — não duplica pois o service não envia mais
    return next(
        req.clone({
            setHeaders: { Authorization: authorization },
        })
    );
}
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EcommerceAuthService } from '../services/ecommerce-auth.service';
import { KeycloakService } from '../services/keycloak.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(EcommerceAuthService);
    // Only intercept backend API endpoints, not general relative routes (like frontend pages /auth/callback)
    const backendEndpoints = ['/auth', '/papeis', '/enderecos', '/usuarios', '/wishlist', '/compras', '/sketchbooks', '/blocos', '/marcas'];
    const isBackendRequest = 
        backendEndpoints.some(endpoint => req.url.startsWith(endpoint)) || 
        req.url.startsWith('http://localhost:8080');

    const isLoginRequest = req.url.includes('/auth/login') || req.url.includes('/protocol/openid-connect');

    if (!isBackendRequest || isLoginRequest) {
        return next(req);
    }

    let authorization = authService.authorizationValue();
    
    if (!authorization) {
        const keycloakService = inject(KeycloakService, { optional: true });
        if (keycloakService) {
            authorization = keycloakService.getAuthorizationHeader();
        }
    }

    if (!authorization) {
        return next(req);
    }

    return next(
        req.clone({
            setHeaders: {
                Authorization: authorization,
            },
        }),
    );
};
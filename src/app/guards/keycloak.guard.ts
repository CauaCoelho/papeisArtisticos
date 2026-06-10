import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

export const keycloakGuard: CanActivateFn = (_route, _state) => {
  const keycloak = inject(KeycloakService);

  if (keycloak.isLoggedIn()) {
    return true;
  }

  keycloak.login();
  return false;
};

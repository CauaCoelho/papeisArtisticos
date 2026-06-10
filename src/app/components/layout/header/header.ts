import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../../services/keycloak.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  toggleSidebar = output<void>();

  readonly keycloak = inject(KeycloakService);

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }
}

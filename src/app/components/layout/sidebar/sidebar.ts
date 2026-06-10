import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '../../../services/keycloak.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly keycloak = inject(KeycloakService);

  isAdmin(): boolean {
    return this.keycloak.isAdmin();
  }
}


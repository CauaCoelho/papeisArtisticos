import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Header } from '../layout/header/header';
import { Footer } from '../layout/footer/footer';
import { Sidebar } from '../layout/sidebar/sidebar';
import { WishlistComponent } from './wishlist/wishlist';
import { ComprasComponent } from './compras/compras';
import { EnderecosComponent } from './enderecos/enderecos';
import { KeycloakService } from '../../services/keycloak.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    Header,
    Footer,
    Sidebar,
    WishlistComponent,
    ComprasComponent,
    EnderecosComponent
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent {
  readonly keycloak = inject(KeycloakService);
  readonly sidebarAberto = signal(false);

  logout(): void {
    this.keycloak.logout();
  }
}

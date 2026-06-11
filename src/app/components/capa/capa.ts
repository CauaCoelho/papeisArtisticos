import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Capa } from '../../models/capa.model';
import { CapaService } from '../../services/capa.service';
import { Header } from '../layout/header/header';
import { Sidebar } from '../layout/sidebar/sidebar';
import { Footer } from '../layout/footer/footer';

@Component({
  selector: 'app-capa',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    Header,
    Sidebar,
    Footer
  ],
  templateUrl: './capa.html',
  styleUrl: './capa.css',
})
export class CapaComponent implements OnInit {
  capas = signal<Capa[]>([]);
  isSidebarOpen = signal(true);

  constructor(private capaService: CapaService) {}

  ngOnInit(): void {
    this.carregarCapas();
  }

  carregarCapas(): void {
    this.capaService.getCapas().subscribe({
      next: (data) => {
        this.capas.set(data);
      },
      error: (err) => {
        console.error('Erro ao carregar capas:', err);
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }
}

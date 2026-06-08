import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasService } from '../../../services/compras.service';
import { CompraDTOResponse } from '../../../models/compra.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatExpansionModule],
  templateUrl: './compras.html',
  styleUrl: './compras.css'
})
export class ComprasComponent implements OnInit {
  private readonly comprasService = inject(ComprasService);

  readonly compras = signal<CompraDTOResponse[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.carregarCompras();
  }

  carregarCompras(): void {
    this.loading.set(true);
    this.comprasService.minhasCompras().subscribe({
      next: (data) => {
        this.compras.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar compras:', err);
        this.errorMessage.set('Não foi possível carregar o histórico de compras.');
        this.loading.set(false);
      }
    });
  }

  getStatusClass(status?: string): string {
    const s = status?.toLowerCase() || '';
    if (s.includes('pago') || s.includes('entregue') || s.includes('concluido') || s.includes('finalizado')) return 'status-pago';
    if (s.includes('cancelado')) return 'status-cancelado';
    return 'status-pendente';
  }
}

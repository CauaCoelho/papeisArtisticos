import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PapelAvulsoService } from '../../services/papel-avulso.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Header } from '../layout/header/header';
import { Footer } from '../layout/footer/footer';
import { Sidebar } from '../layout/sidebar/sidebar';

@Component({
  selector: 'app-papeis-avulsos-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule, Header, Footer, Sidebar],
  templateUrl: './papeis-avulsos-catalog.html',
  styleUrl: '../catalog/catalog.css',
})
export class PapeisAvulsosCatalog implements OnInit {
  readonly produtos = signal<any[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly searchTermSignal = signal('');
  readonly sidebarAberto = signal(false);

  get searchTerm(): string { return this.searchTermSignal(); }
  set searchTerm(value: string) { this.searchTermSignal.set(value); }

  readonly produtosFiltrados = computed(() => {
    const term = this.searchTerm.toLowerCase().trim();
    const items = this.produtos();
    if (!term) return items;
    return items.filter(p =>
      p.nome?.toLowerCase().includes(term) ||
      p.tipoPapel?.toLowerCase().includes(term) ||
      p.tamanho?.toLowerCase().includes(term)
    );
  });

  constructor(
    private papelService: PapelAvulsoService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.papelService.findAll(0, 100).subscribe({
      next: (data: any) => {
        const raw: any[] = Array.isArray(data) ? data : (data?.data ?? []);
        const mapped = raw.map((p: any) => {
          const arquivos = p.imagens || p.arquivos || [];
          const texturaNome = (p.textura as any)?.nome || p.textura || '';
          return {
            ...p,
            nome: p.nome || `${p.tipoPapel || 'Papel'} ${p.tamanho || ''}`.trim(),
            preco: p.preco || 29.90,
            detalhe: `Tamanho ${p.tamanho || '--'} · ${texturaNome || 'Textura padrão'}`,
            imagemUrl: arquivos.length > 0
              ? `/papeis/image/download/${arquivos[0].fid}`
              : 'https://via.placeholder.com/300x220?text=Papel+Avulso'
          };
        });
        this.produtos.set(mapped);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(`Erro ao carregar papéis avulsos: ${err.status}`);
        this.loading.set(false);
      }
    });
  }

  filtrarProdutos(): void { }

  trackById(_: number, p: any) { return p?.id ?? _; }

  adicionarAoCarrinho(produto: any, event: Event): void {
    event.stopPropagation();
    this.carrinhoService.adicionar({
      varianteProdutoId: produto.id,
      nomeProduto: produto.nome,
      formato: produto.tamanho || 'A4',
      gramatura: produto.especificacaoTecnica?.gramatura || 150,
      cor: 'Padrão',
      preco: produto.preco,
      quantidade: 1
    });
    alert(`${produto.nome} adicionado ao carrinho!`);
  }
}

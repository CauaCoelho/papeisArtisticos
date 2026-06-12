import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PapelAvulsoService } from '../../services/papel-avulso.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { WishlistService } from '../../services/wishlist.service';
import { KeycloakService } from '../../services/keycloak.service';
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
  private readonly wishlistIds = signal<Set<number>>(new Set());

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
    private carrinhoService: CarrinhoService,
    private wishlistService: WishlistService,
    public keycloakService: KeycloakService
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
              : 'https://via.placeholder.com/300x220?text=Papel+Avulso',
            inWishlist: false
          };
        });
        this.produtos.set(mapped);
        this.carregarWishlist();
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

  private carregarWishlist(): void {
    if (!this.keycloakService.isLoggedIn()) {
      this.wishlistIds.set(new Set());
      return;
    }

    this.wishlistService.listar().subscribe({
      next: (items) => {
        const ids = new Set(items.map(item => item.produtoId));
        this.wishlistIds.set(ids);
        this.produtos.update(current => current.map(produto => ({
          ...produto,
          inWishlist: ids.has(produto.id ?? produto.produtoId)
        })));
      },
      error: (err) => console.error('Erro ao carregar wishlist do usuário:', err)
    });
  }

  toggleWishlist(produto: any, event: Event): void {
    event.stopPropagation();
    if (!this.keycloakService.isLoggedIn()) {
      this.keycloakService.login();
      return;
    }

    const produtoId = produto.id ?? produto.produtoId;
    if (!produtoId) {
      console.error('Produto sem id para wishlist:', produto);
      return;
    }

    if (produto.inWishlist) {
      this.wishlistService.remover(produtoId).subscribe({
        next: () => {
          produto.inWishlist = false;
          this.carregarWishlist();
        },
        error: (err) => console.error('Erro ao remover da wishlist', err)
      });
    } else {
      this.wishlistService.adicionar(produtoId).subscribe({
        next: () => {
          produto.inWishlist = true;
          this.carregarWishlist();
        },
        error: (err) => console.error('Erro ao adicionar à wishlist', err)
      });
    }
  }

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

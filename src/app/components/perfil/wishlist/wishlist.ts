import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WishlistService } from '../../../services/wishlist.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { ProdutoService } from '../../../services/produto.service';
import { WishlistDTOResponse } from '../../../models/wishlist.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly carrinhoService = inject(CarrinhoService);
  private readonly produtoService = inject(ProdutoService);

  readonly items = signal<WishlistDTOResponse[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.carregarWishlist();
  }

  carregarWishlist(): void {
    this.loading.set(true);
    this.wishlistService.listar().subscribe({
      next: (data) => {
        const wishlistItems = (data || []).map(item => ({
          ...item,
          produtoNome: item.produtoNome || item.produto?.nome || '',
          marca: item.marca ?? item.produto?.marca?.nome ?? item.produto?.marca,
          preco: item.preco ?? item.produto?.preco,
          produtoImagem: item.produtoImagem ?? item.produto?.imagemUrl,
        }));

        const fetches = wishlistItems.map(item => {
          const needsDetails = !item.marca || item.preco == null || !item.produto;
          if (!needsDetails) {
            return of(item);
          }

          return this.produtoService.findById(item.produtoId).pipe(
            map(prod => ({
              ...item,
              produto: prod,
              marca: item.marca ?? prod?.marca?.nome ?? prod?.marca,
              preco: item.preco ?? prod?.preco,
              produtoNome: item.produtoNome || prod?.nome || item.produtoNome,
              produtoImagem: item.produtoImagem ?? prod?.imagemUrl,
            })),
            catchError((err) => {
              console.error('Erro ao carregar detalhes do produto wishlist:', err);
              return of(item);
            })
          );
        });

        forkJoin(fetches).subscribe({
          next: (resolvedItems) => {
            this.items.set(resolvedItems);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Erro ao carregar itens da wishlist:', err);
            this.items.set(wishlistItems);
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao carregar lista de desejos:', err);
        this.errorMessage.set('Não foi possível carregar a lista de desejos.');
        this.loading.set(false);
      }
    });
  }

  removerItem(produtoId: number, event: Event): void {
    event.stopPropagation();
    this.wishlistService.remover(produtoId).subscribe({
      next: () => {
        this.items.update(current => current.filter(item => item.produtoId !== produtoId));
      },
      error: (err) => {
        console.error('Erro ao remover da lista de desejos:', err);
        alert('Erro ao remover o produto da lista de desejos.');
      }
    });
  }

  adicionarAoCarrinho(item: WishlistDTOResponse, event: Event): void {
    event.stopPropagation();
    const prod = item.produto ?? {
      id: item.produtoId,
      nome: item.produtoNome,
      preco: item.preco ?? 0
    };

    this.carrinhoService.adicionar({
      varianteProdutoId: prod.id,
      nomeProduto: prod.nome || 'Produto',
      formato: 'A4',
      gramatura: 180,
      cor: 'Padrão',
      preco: prod.preco || 0,
      quantidade: 1
    });
    alert(`${prod.nome} adicionado ao carrinho!`);
  }

  getProductBrand(item: WishlistDTOResponse): string {
    return item.produto?.marca?.nome ?? item.produto?.marca ?? item.marca ?? 'Marca Genérica';
  }

  getProductPrice(item: WishlistDTOResponse): number {
    return item.produto?.preco ?? item.preco ?? 0;
  }

  getImagemUrl(item: WishlistDTOResponse): string {
    if (item.produtoImagem) {
      return item.produtoImagem.startsWith('http')
        ? item.produtoImagem
        : `/papeis/image/download/${item.produtoImagem}`;
    }

    if (item.produto?.imagemUrl) {
      return item.produto.imagemUrl;
    }

    const arquivos = item.produto?.imagens || item.produto?.arquivos;
    if (arquivos && arquivos.length > 0) {
      return `/papeis/image/download/${arquivos[0].fid}`;
    }
    return 'https://via.placeholder.com/300x200?text=Arte+e+Cor';
  }
}

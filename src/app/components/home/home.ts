import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../services/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  readonly produtos = signal<any[]>([]);
  readonly errorMessage = signal('');
  readonly searchTermSignal = signal('');

  get searchTerm(): string {
    return this.searchTermSignal();
  }

  set searchTerm(value: string) {
    this.searchTermSignal.set(value);
  }

  readonly produtosFiltrados = computed(() => {
    const term = this.searchTerm.toLowerCase().trim();
    const items = this.produtos();

    if (!term) {
      return items;
    }

    return items.filter(p =>
      p.nome?.toLowerCase().includes(term) ||
      p.marca?.nome?.toLowerCase().includes(term) ||
      p.textura?.toString().toLowerCase().includes(term)
    );
  });

  constructor(
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService
  ) { }

  ngOnInit(): void {
    console.log('[HOME] ngOnInit chamado - iniciando busca de produtos...');
    this.produtoService.findAllProdutos().subscribe({
      next: (data: any) => {
        const rawProdutos: any[] = Array.isArray(data)
          ? data
          : (data?.data as any[]) ?? (data?.produtos as any[]) ?? [];

        console.log('[HOME] Dados recebidos do backend:', data);
        console.log('[HOME] Tipo:', typeof data, 'É array?', Array.isArray(data), 'Tamanho:', rawProdutos?.length);

        try {
          const mappedProdutos = (rawProdutos || []).map((p: any) => {
            const arquivos = p.imagens || p.arquivos;
            const temImagem = arquivos && arquivos.length > 0;
            return {
              ...p,
              nome: p.nome || `${p.marca?.nome || 'Marca Desconhecida'} - ${(p.textura as any)?.nome || p.textura || 'Produto Exclusivo'}`,
              preco: p.preco || 99.90,
              imagemUrl: temImagem
                ? `/papeis/image/download/${arquivos[0].nomeImagem}`
                : 'https://via.placeholder.com/300x200?text=Arte+e+Cor'
            };
          });

          this.produtos.set(mappedProdutos);
          console.log('[HOME] Produtos mapeados com sucesso:', mappedProdutos.length);
        } catch (e: any) {
          console.error('[HOME] Mapping error:', e);
          this.errorMessage.set('Erro interno ao processar produtos: ' + e.message);
        }
      },
      error: (err) => {
        console.error('[HOME] ERRO HTTP ao carregar produtos:', err);
        console.error('[HOME] Status:', err.status, 'StatusText:', err.statusText, 'URL:', err.url);
        this.errorMessage.set(`Erro HTTP ${err.status}: ${err.message}`);
      }
    });
  }

  filtrarProdutos(): void {
    // O computed produtosFiltrados já reage ao valor de searchTerm.
    // A chamada é mantida para disparar a atualização via ngModelChange.
  }

  trackByProdutoId(index: number, produto: any): any {
    return produto?.id ?? index;
  }

  adicionarAoCarrinho(produto: any, event: Event): void {
    event.stopPropagation(); // Evitar navegar para a tela de detalhes ao clicar no botão
    this.carrinhoService.adicionar({
      varianteProdutoId: produto.id,
      nomeProduto: produto.nome,
      formato: produto.formato || 'A4',
      gramatura: produto.especificacaoTecnica?.gramatura || 180,
      cor: 'Padrão',
      preco: produto.preco,
      quantidade: 1
    });
    alert(`${produto.nome} adicionado ao carrinho!`);
  }
}

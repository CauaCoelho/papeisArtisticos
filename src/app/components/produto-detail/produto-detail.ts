import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../services/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-produto-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule, MatChipsModule, MatTabsModule],
  templateUrl: './produto-detail.html',
  styleUrl: './produto-detail.css',
})
export class ProdutoDetail implements OnInit {
  produto: any;
  imagens: string[] = [];
  imagemPrincipal: string = '';
  quantidade: number = 1;
  produtosSemelhantes: any[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.carregarProduto(Number(idStr));
      }
    });
  }

  carregarProduto(id: number): void {
    console.log('carregarProduto chamado com id:', id);
    this.loading = true;
    this.produtoService.findById(id).subscribe({
      next: (data) => {
        try {
          this.produto = {
            ...data,
            nome: (data as any).nome || `${(data as any).marca?.nome || 'Marca Desconhecida'} - ${(data as any).textura?.nome || 'Produto Exclusivo'}`,
            preco: (data as any).preco || 99.90,
            textura: (data as any).textura?.nome || (data as any).textura, // normaliza para string
          };

          this.imagens = ((data as any).imagens?.length > 0)
            ? (data as any).imagens.map((img: any) => `http://localhost:8080/papeis/image/download/${img.fid}`)
            : ['https://via.placeholder.com/600x400?text=Sem+Imagem'];

          this.imagemPrincipal = this.imagens[0];
          this.carregarProdutosSemelhantes();
        } catch (e) {
          console.error('Erro ao processar dados do produto', e);
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar produto', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  uploadImagem(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.produtoService.uploadImagem(this.produto.id, input.files[0])
      .subscribe({
        next: () => {
          alert('Imagem enviada com sucesso!');
          this.carregarProduto(this.produto.id);
        },
        error: (err: any) => console.error('Erro no upload', err)
      });
  }
  carregarProdutosSemelhantes(): void {
    this.produtoService.findAllProdutos().subscribe({
      next: (data) => {
        const processed = data
          .filter(p => p.id !== this.produto.id)
          .map(p => ({
            ...p,
            nome: p.nome || `${p.marca?.nome || 'Marca Genérica'} - ${p.textura || 'Papel'}`,
            preco: (p as any).preco || 89.90,
            imagemUrl: (p as any).imagens && (p as any).imagens.length > 0
              ? `http://localhost:8080/papeis/image/download/${(p as any).imagens[0].fid}`
              : 'https://via.placeholder.com/300x200?text=Produto+Semelhante'
          }))
          .slice(0, 4); // Take up to 4
        this.produtosSemelhantes = processed;
      }
    });
  }

  alterarImagemPrincipal(img: string): void {
    this.imagemPrincipal = img;
  }

  incrementarQuantidade(): void {
    this.quantidade++;
  }

  decrementarQuantidade(): void {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  adicionarAoCarrinho(): void {
    if (!this.produto) return;

    this.carrinhoService.adicionar({
      varianteProdutoId: this.produto.id,
      nomeProduto: this.produto.nome,
      formato: this.produto.formato || 'A4',
      gramatura: this.produto.especificacaoTecnica?.gramatura || 180,
      cor: 'Padrão',
      preco: this.produto.preco,
      quantidade: this.quantidade
    });
    alert(`${this.quantidade}x ${this.produto.nome} adicionado ao carrinho!`);
  }
}

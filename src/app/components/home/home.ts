import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../services/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../models/produto.model';
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
  produtos: any[] = [];
  produtosFiltrados: any[] = [];
  searchTerm: string = '';

  constructor(
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.produtoService.findAllProdutos().subscribe({
      next: (data) => {
        // Mapeando dados da API e adicionando campos visuais temporários (mockados)
        this.produtos = data.map(p => ({
          ...p,
          nome: p.nome || `${p.marca?.nome || 'Marca Desconhecida'} - ${p.textura || 'Produto Exclusivo'}`,
          preco: (p as any).preco || 99.90, // mock price
          imagemUrl: (p as any).imagens && (p as any).imagens.length > 0 
                      ? `http://localhost:8080/produtos/download/${(p as any).imagens[0].nomeImagem}`
                      : 'https://via.placeholder.com/300x200?text=Arte+e+Cor'
        }));
        this.produtosFiltrados = this.produtos;
      },
      error: (err) => console.error('Erro ao carregar produtos', err)
    });
  }

  filtrarProdutos(): void {
    if (!this.searchTerm) {
      this.produtosFiltrados = this.produtos;
      return;
    }
    const termo = this.searchTerm.toLowerCase();
    this.produtosFiltrados = this.produtos.filter(p => 
      p.nome?.toLowerCase().includes(termo) || 
      p.marca?.nome?.toLowerCase().includes(termo) ||
      p.textura?.toString().toLowerCase().includes(termo)
    );
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

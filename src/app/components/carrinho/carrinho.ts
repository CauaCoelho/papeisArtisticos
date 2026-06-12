import { Component } from '@angular/core';
import { CarrinhoService } from '../../services/carrinho.service';
import { ComprasService } from '../../services/compras.service';
import { CarrinhoItem } from '../../models/carrinho-item.model';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  varianteSelecionada: any;
  produto: any;
  constructor(
    private carrinhoService: CarrinhoService,
    private comprasService: ComprasService,
    private router: Router
  ) {}

  get itens(): CarrinhoItem[] {
    const list = this.carrinhoService.listar();
    return list.map(item => ({
      ...item,
      imagemUrl: item.imagemUrl || 'https://via.placeholder.com/150x150?text=Produto'
    }));
  }

  get totalCarrinho(): number {
    return this.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  }

  incrementar(item: CarrinhoItem) {
    item.quantidade++;
    // O service não tem método para atualizar diretamente, mas os itens são por referência.
    // O ideal seria recriar/salvar, então chamamos adicionar com 1, ou apenas salvamos se houver um método.
    // Como workaround para o que existe, eu posso forçar a adição de 0 para salvar no localstorage, ou reimplementar
    // Mas eu posso só salvar no localstorage chamando o localStorage diretamente:
    localStorage.setItem('carrinho', JSON.stringify(this.carrinhoService.listar()));
  }

  decrementar(item: CarrinhoItem) {
    if (item.quantidade > 1) {
      item.quantidade--;
      localStorage.setItem('carrinho', JSON.stringify(this.carrinhoService.listar()));
    }
  }

  removerItem(id: number) {
    this.carrinhoService.remover(id);
  }

  adicionarAoCarrinho() {
    // legacy method
  }

  finalizarCompra() {
    const itensCompra = this.itens.map(item => ({
      produtoId: item.varianteProdutoId,
      nomeProduto: item.nomeProduto || '',
      quantidade: item.quantidade,
      preco: item.preco,
      subtotal: item.preco * item.quantidade
    }));

    if (itensCompra.length === 0) {
      return;
    }

    const total = this.totalCarrinho;

    this.comprasService.registrarCompra({ itens: itensCompra, total }).subscribe({
      next: () => {
        this.carrinhoService.limpar();
        this.router.navigateByUrl('/perfil');
      },
      error: (err) => {
        console.error('Erro ao registrar compra:', err);
        this.carrinhoService.limpar();
        this.router.navigateByUrl('/perfil');
      }
    });
  }
}
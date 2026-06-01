import { Component } from '@angular/core';
import { CarrinhoService } from '../../services/carrinho.service';
import { CarrinhoItem } from '../../models/carrinho-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrinho',
  imports: [],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  varianteSelecionada: any;
  produto: any;
  constructor(private carrinhoService: CarrinhoService,
    private router: Router
  ) {

  }

  get itens(): CarrinhoItem[] {
    return this.carrinhoService.listar();
  }

  adicionarAoCarrinho() {
    this.carrinhoService.adicionar({
      varianteProdutoId: this.varianteSelecionada.id,
      nomeProduto: this.produto.nome,
      formato: this.varianteSelecionada.formato,
      gramatura: this.varianteSelecionada.gramatura,
      cor: this.varianteSelecionada.cor,
      preco: this.varianteSelecionada.preco,
      quantidade: 1
    });
  }

  mostrarResumoCompra() {

  }

  finalizarCompra() {
    console.log('Compra finalizada!');
    this.carrinhoService.limpar();
    this.router.navigateByUrl('/home');

  }
}
import { Component } from '@angular/core';
import { CarrinhoService } from '../../services/carrinho.service';
import { CarrinhoItem } from '../../models/carrinho-item.model';

@Component({
  selector: 'app-carrinho',
  imports: [],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  constructor(private carrinhoService: CarrinhoService) { }

  get itens(): CarrinhoItem[] {
    return this.carrinhoService.listar();
  }

  /* 
   * TODO: Este método foi comentado pois `varianteSelecionada` e `produto` 
   * não existem no componente de Carrinho. Ele deve ser movido para o 
   * componente ProdutoDetail (ou similar).
   */
  /*
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
  */

  finalizarCompra() {
    console.log('Compra finalizada!');
    this.carrinhoService.limpar();
  }
}
import { Injectable } from "@angular/core";
import { CarrinhoItem } from "../models/carrinho-item.model";

@Injectable({
    providedIn: 'root'
})
export class CarrinhoService {

    private itens: CarrinhoItem[] = [];

    adicionar(item: CarrinhoItem) {

        const existente = this.itens.find(
            i => i.varianteProdutoId === item.varianteProdutoId
        );

        if (existente) {
            existente.quantidade++;
        } else {
            this.itens.push(item);
        }

        this.salvarLocalStorage();
    }

    listar(): CarrinhoItem[] {
        return this.itens;
    }

    remover(varianteProdutoId: number) {

        this.itens = this.itens.filter(
            i => i.varianteProdutoId !== varianteProdutoId
        );

        this.salvarLocalStorage();
    }

    limpar() {
        this.itens = [];
        this.salvarLocalStorage();
    }

    private salvarLocalStorage() {
        localStorage.setItem(
            'carrinho',
            JSON.stringify(this.itens)
        );
    }
}
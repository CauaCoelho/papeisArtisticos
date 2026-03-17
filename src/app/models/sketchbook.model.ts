import { Capa } from "./capa.model";

export class Sketchbook {
    id!: number;
    nome: string;
    quantidadefolhas: string
    capa?: Capa;
    constructor(nome: string, quantidadefolhas: string, capa?: Capa) {
        this.nome = nome;
        this.quantidadefolhas = quantidadefolhas;
        this.capa = capa;
    }
    
}

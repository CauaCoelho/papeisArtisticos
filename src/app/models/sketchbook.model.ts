import { Capa } from "./capa.model";
import { Produto } from "./produto.model";

export class Sketchbook extends Produto{
    quantidadefolhas!: string
    capa!: Capa;
  
    
}

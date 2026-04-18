import { Capa } from "./capa.model";
import { Produto } from "./produto.model";

export class Sketchbook extends Produto{
    idTextura!: number;
    quantidadeFolhas!: number;
    capa!: Capa;
  
    
}

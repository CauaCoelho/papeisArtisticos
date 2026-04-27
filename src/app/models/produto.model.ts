import { Formato } from "../enums/formato.enum";
import { Textura } from "../enums/textura.enum";
import { EspecificacaoTecnica } from "./especificacao-tecnica.model";

export abstract class Produto {
    id!: number;
    nome!: string;
    textura!: Textura;
    formato!: Formato;
    especificacaoTecnica!: EspecificacaoTecnica;
}

import { Formato } from "../enums/formato.enum";
import { Textura } from "../enums/textura.enum";

export abstract class Produto {
    id!: number;
    nome!: string;
    textura!: Textura;
    formato!: Formato;
}

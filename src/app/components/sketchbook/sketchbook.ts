import { Component } from '@angular/core';
import { Papel } from '../papel/papel';
import { Capa } from '../capa/capa';
import { Textura } from '../../enums/textura.enum';
import { Formato } from '../../enums/formato.enum';

@Component({
  selector: 'app-sketchbook',
  imports: [],
  templateUrl: './sketchbook.html',
  styleUrl: './sketchbook.css',
})
export class Sketchbook extends Papel {
  quantidadeFolhas!: number;
  capa!: Capa;

  constructor(
    id?: number,
    nome?: string,
    textura?: Textura,
    formato?: Formato,
    quantidadeFolhas?: number,
    capa?: Capa
  ) {
    super();
    this.id = id ?? 0;
    this.nome = nome ?? '';
    this.textura = textura ?? new Textura();
    this.formato = formato ?? Formato.A4;
    this.quantidadeFolhas = quantidadeFolhas ?? 0;
    this.capa = capa ?? new Capa();
  }
}

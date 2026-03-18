import { Textura } from '../../enums/textura.enum';
import { Formato } from '../../enums/formato.enum';

export class Produto {
  id?: number;
  nome?: string;
  textura?: Textura;
  formato?: Formato;
}

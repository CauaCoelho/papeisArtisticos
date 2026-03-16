import { Textura } from '../../enums/textura.enum';
import { Formato } from '../../enums/formato.enum';

export class Papel {
  id?: number;
  nome?: string;
  textura?: Textura;
  formato?: Formato;
}

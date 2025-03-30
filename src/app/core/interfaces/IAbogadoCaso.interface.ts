import IAbogado from './IAbogado.interface.js';
import { ICaso } from './ICaso.interface.js';

export interface IAbogadoCaso {
  id: number;
  abogado: IAbogado;
  caso: ICaso;
  es_principal: boolean;
  fecha_alta: Date;
  fecha_baja: Date | null;
}

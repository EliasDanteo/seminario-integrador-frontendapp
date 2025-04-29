import { IAbogado } from './IAbogado.interface.js';
import { ICaso } from './ICaso.interface.js';

export interface IRecordatorio {
  id: number;
  caso: ICaso;
  abogado: { id: number; nombre: string; apellido: string } | IAbogado;
  descripcion: string;
  fecha_hora_limite: Date;
  vencido: boolean;
}

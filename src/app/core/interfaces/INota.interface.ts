import { IAbogado } from './IAbogado.interface.js';
import { ICaso } from './ICaso.interface.js';

export interface INota {
  id: number;
  abogado: IAbogado;
  caso: ICaso;
  fecha_hora: Date;
  titulo: string;
  descripcion: string;
  sePuedeEliminar?: boolean;
}

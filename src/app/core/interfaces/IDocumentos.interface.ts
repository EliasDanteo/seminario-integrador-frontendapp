import { ICaso } from './ICaso.interface.js';

export interface IDocumentos {
  id: number;
  nombre: string;
  archivo: Blob;
  fecha_carga: Date;
  fecha_baja?: Date;
  caso: ICaso;
}

import { ICaso } from './ICaso.interface.js';

export interface IDocumentos {
  id: number;
  nombre: string;
  archivo: Blob;
  fechaCarga: Date;
  fechaBaja?: Date;
  Caso: ICaso;
}

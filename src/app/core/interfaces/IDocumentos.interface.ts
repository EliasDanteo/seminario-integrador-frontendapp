import { ICaso } from './ICaso.interface.js';

export default interface IDocumentos {
  id: number;
  nombre: string;
  archivo: Blob;
  fecha_carga: Date;
  fecha_baja?: Date;
  Caso: ICaso;
}

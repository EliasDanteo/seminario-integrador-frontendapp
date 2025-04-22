import { ICaso } from './ICaso.interface.js';

export interface ICuota {
  caso: ICaso;
  numero: number;
  cant_jus: number;
  fecha_vencimiento: Date;
  fecha_hora_cobro?: Date;
  forma_cobro?: string;
}

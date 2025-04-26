import { IAbogado } from './IAbogado.interface.js';
import { IActividad } from './IActividad.interface.js';
import { ICliente } from './ICliente.interface.js';

export interface IActividadRealizada {
  id: number;
  fecha_hora: Date;
  actividad: IActividad;
  abogado: IAbogado;
  cliente: ICliente;
}

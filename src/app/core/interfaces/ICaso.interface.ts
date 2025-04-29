import { IAbogado } from './IAbogado.interface.js';
import { ICliente } from './ICliente.interface.js';

export interface ICaso {
  id: number;
  cliente: ICliente;
  especialidad: {
    //TODO: CAMBIAR A ESPECIALIDAD CUANDO ESTE HECHO
    id: number;
    nombre: string;
  };
  fecha_inicio: string;
  descripcion: string;
  estado: string;
  fecha_estado: string;
  abogado_principal: IAbogado;
}

export interface IFinalizarCaso {
  cant_jus: number;
  fecha_primer_cobro: Date;
  frecuencia_cobro: string;
  num_cuotas: number;
}

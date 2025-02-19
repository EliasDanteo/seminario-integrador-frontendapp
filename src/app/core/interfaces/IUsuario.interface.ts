import IAbogado from './IAbogado.interface.js';
import { ICliente } from './ICliente.interface.js';

export interface IUsuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipo_doc: string;
  nro_doc: string;
  fecha_alta: Date;
  fecha_baja?: Date;
  abogado?: IAbogado;
  cliente?: ICliente; //TODO: HASTA CREAR LA INTERFAZ DE CLIENTE
  secretario?: string; //TODO: HASTA CREAR LA INTERFAZ DE SECRETARIO
}

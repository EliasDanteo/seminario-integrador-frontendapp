import { IAbogado } from './IAbogado.interface.js';
import { ICliente } from './ICliente.interface.js';
import { ISecretario } from './ISecretario.interface.js';

export interface IUsuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipo_doc: string;
  nro_doc: string;
  fecha_alta: Date;
  fecha_baja?: Date;
  abogado?: IAbogado;
  cliente?: ICliente;
  secretario?: ISecretario;
}

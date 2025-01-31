import IAbogado from './IAbogado.interface.js';

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
  cliente?: string; //TODO: HASTA CREAR LA INTERFAZ DE CLIENTE
  secretario?: string; //TODO: HASTA CREAR LA INTERFAZ DE SECRETARIO
}

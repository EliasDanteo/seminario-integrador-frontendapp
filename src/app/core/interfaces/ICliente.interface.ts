import { IUsuario } from './IUsuario.interface.js';
export interface ICliente extends IUsuario {
  es_empresa: boolean;
  is_admin: boolean;
  tipo_usuario: string;
}

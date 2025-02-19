import { IUsuario } from './IUsuario.interface.js';
export interface ICliente extends IUsuario {
  es_empresa: boolean;
}

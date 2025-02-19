import { IUsuario } from './IUsuario.interface.js';
export interface ISecretario extends IUsuario {
  turno_trabajo: string;
}

import { IUsuario } from './IUsuario.interface.js';

export default interface IAbogado extends IUsuario {
  foto?: Blob;
  matricula: string;
  rol?: string;
  especialidades?: string[]; //TODO: hasta crear la interfaz de especialidades
  horarioTurnos?: string[]; //TODO: hasta crear la interfaz de horarios
}

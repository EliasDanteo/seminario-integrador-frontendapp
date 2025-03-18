import { IUsuario } from './IUsuario.interface.js';

export default interface IAbogado extends IUsuario {
  id_abogado: number;
  foto?: Blob | { type: string; data: number[] };
  matricula: string;
  rol?: { id: number; nombre: string };
  especialidades?: string[]; //TODO: hasta crear la interfaz de especialidades
  horarioTurnos?: string[]; //TODO: hasta crear la interfaz de horarios
}

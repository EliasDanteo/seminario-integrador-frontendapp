import { IUsuario } from './IUsuario.interface.js';

export interface IAbogado extends IUsuario {
  foto?: Blob | { type: string; data: number[] };
  matricula: string;
  rol: { id: number; nombre: string };
  especialidades: number[]; //TODO: hasta crear la interfaz de especialidades
  horarioTurnos?: string[]; //TODO: hasta crear la interfaz de horarios
  id_abogado: string; // NO LO SAQUES PORQUE ASI DEVUELVE LA BD
}

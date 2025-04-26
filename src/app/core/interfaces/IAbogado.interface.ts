import { IEspecialidad } from './IEspecialidad.interface.js';
import { IUsuario } from './IUsuario.interface.js';

export interface IAbogado extends IUsuario {
  foto: Blob;
  matricula: string;
  rol: { id: number; nombre: string };
  especialidades: IEspecialidad[];
  horarioTurnos?: string[]; //TODO: hasta crear la interfaz de horarios
  id_abogado: string; // NO LO SAQUES PORQUE ASI DEVUELVE LA BD
}

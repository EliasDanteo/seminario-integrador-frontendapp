import { IAbogado } from './IAbogado.interface.js';

export interface IComentario {
  id: number;
  abogado: { nombre: string; apellido: string } | IAbogado;
  padre: IComentario | null;
  respuestas: IComentario[];
  fecha_hora: Date;
  comentario: string;
  mostrarRespuestas?: boolean;
}

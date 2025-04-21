import { IAbogado } from './IAbogado.interface';
import { ITurnoOtorgado } from './ITurnoOtorgado.interface';

export interface IHorarioTurno {
  id: number;
  abogado: Pick<IAbogado, 'id' | 'nombre' | 'apellido'>;
  hora_inicio: string;
  hora_fin: string;
  dia_semana: number;
  fecha_baja?: string;
}

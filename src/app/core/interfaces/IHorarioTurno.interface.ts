import { IAbogado } from './IAbogado.interface';
import { ITurnoOtorgado } from './ITurnoOtorgado.interface';

export interface IHorarioTurno {
  id: number;
  hora_inicio: string;
  hora_fin: string;
  fecha_baja?: string;
  dia_semana: number;
  abogado: Pick<IAbogado, 'id' | 'nombre' | 'apellido'>;
  turnosOtorgados: ITurnoOtorgado[];
}

import { ICliente } from './ICliente.interface';
import { IHorarioTurno } from './IHorarioTurno.interface';

export interface ITurnoOtorgado {
  id?: number;
  fecha_turno: Date;
  horario_turno: IHorarioTurno;
  id_horario_turno: number;
  cliente: Partial<ICliente>;
  fecha_cancelacion?: Date;
}

import { ICliente } from './ICliente.interface';
import { IHorarioTurno } from './IHorarioTurno.interface';

export interface ITurnoOtorgado {
  id?: number;
  fecha_turno: Date;
  horario_turno: IHorarioTurno;
  cliente: Partial<ICliente>;
  fecha_cancelacion?: Date;
}

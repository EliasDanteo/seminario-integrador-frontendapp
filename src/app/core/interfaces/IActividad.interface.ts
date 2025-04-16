export interface IActividad {
  id: number;
  nombre: string;
  fecha_baja?: Date;
  cant_jus?: number;
  fecha_hora_desde: Date;
  precio_pesos?: number;
}

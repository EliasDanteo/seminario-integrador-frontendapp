export interface IUsuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipo_doc: string;
  nro_doc: string;
  fecha_alta: Date;
  fecha_baja?: Date;
}

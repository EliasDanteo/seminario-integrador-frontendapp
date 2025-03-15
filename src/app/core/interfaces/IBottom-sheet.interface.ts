export interface BottomSheetConfig<T> {  //Se puede mover a un archivo aparte
  title: string;
  fields: { label: string; key: string; type?: 'text' | 'textarea' }[];      
  data: T;
}

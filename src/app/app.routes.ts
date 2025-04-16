import { Routes } from '@angular/router';
import { AbogadosListComponent } from './abogados-crud/abogados-list/abogados-list.component.js';
import { ClientesListComponent } from './clientes-crud/clientes-list/clientes-list.component.js';
import { SecretariosListComponent } from './secretarios-list/secretarios-list.component.js';
import { CasosListComponent } from './cuu-casos/casos-list/casos-list.component.js';
import { ActividadesListComponent } from './actividad-crud/actividades-list/actividades-list.component.js';
import { NoticiasListComponent } from './noticias-crud/noticias-list/noticias-list.component.js';
import { NoticiasBlogComponent } from './noticias-crud/noticias-blog/noticias-blog.component.js';
import { NoticiaDetalleComponent } from './noticias-crud/noticia-detalle/noticia-detalle.component.js';

export const routes: Routes = [
  {
    path: 'abogados-list',
    component: AbogadosListComponent,
  },
  {
    path: 'clientes-list',
    component: ClientesListComponent,
  },
  {
    path: 'secretarios-list',
    component: SecretariosListComponent,
  },

  {
    path: 'actividades-list',
    component: ActividadesListComponent,
  },
  {
    path: 'casos-list',
    component: CasosListComponent,
  },
  {
    path: 'noticias-list',
    component: NoticiasListComponent,
  },
  {
    path: 'noticias-blog',
    component: NoticiasBlogComponent,
  },
  {
    path: 'noticias-detalle/:id',
    component: NoticiaDetalleComponent,
  },
];

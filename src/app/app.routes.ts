import { Routes } from '@angular/router';
import { AbogadosListComponent } from './pages/abogados-crud/abogados-list/abogados-list.component.js';
import { ClientesListComponent } from './pages/clientes-crud/clientes-list/clientes-list.component.js';
import { SecretariosListComponent } from './pages/secretarios-list/secretarios-list.component.js';
import { CasosListComponent } from './pages/cuu-casos/casos-list/casos-list.component.js';
import { ActividadesListComponent } from './pages/actividad-crud/actividades-list/actividades-list.component.js';
import { NoticiasListComponent } from './pages/noticias-crud/noticias-list/noticias-list.component.js';
import { NoticiasBlogComponent } from './pages/noticias-crud/noticias-blog/noticias-blog.component.js';
import { NoticiaDetalleComponent } from './pages/noticias-crud/noticia-detalle/noticia-detalle.component.js';
import { CasosInformationDialogComponent } from './pages/cuu-casos/casos-information-dialog/casos-information-dialog.component.js';
import { LoginComponent } from './pages/login/login.component.js';
import { AppointmentBookingComponent } from './pages/appointment-booking/appointment-booking.component.js';

export const routes: Routes = [
  {
    path: 'obtener-turnos',
    component: AppointmentBookingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
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
  { path: 'casos/:id', component: CasosInformationDialogComponent },
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

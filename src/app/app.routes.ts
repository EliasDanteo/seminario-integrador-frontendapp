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
import { HorariosTurnosListComponent } from './pages/horarios-turnos-crud/horarios-turnos-list/horarios-turnos-list.component.js';
import { MisActividadesComponent } from './pages/actividades-realizadas-crud/mis-actividades/mis-actividades.component.js';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component.js';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component.js';
import { adminGuard } from './core/guards/admin.guard.js';
import { abogadoGuard } from './core/guards/abogado.guard.js';
import { authGuard } from './core/guards/auth.guard.js';
import { clienteGuard } from './core/guards/cliente.guard.js';
import { HomeComponent } from './pages/home/home.component.js';
import { secretarioAbogadoGuard } from './core/guards/secretario-abogado.guard.js';
import { TurnosListComponent } from './pages/turnos-list/turnos-list.component.js';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [authGuard],
    component: HomeComponent,
  },
  {
    path: 'restablecer-contrasena',
    component: ResetPasswordComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'obtener-turnos',
    component: AppointmentBookingComponent,
  },
  {
    path: 'noticias-blog',
    component: NoticiasBlogComponent,
  },
  {
    path: 'abogados-list',
    canActivate: [adminGuard],
    component: AbogadosListComponent,
  },
  {
    path: 'clientes-list',
    canActivate: [adminGuard],
    component: ClientesListComponent,
  },
  {
    path: 'secretarios-list',
    canActivate: [adminGuard],
    component: SecretariosListComponent,
  },
  {
    path: 'actividades-list',
    canActivate: [adminGuard],
    component: ActividadesListComponent,
  },
  {
    path: 'casos-list',
    canActivate: [authGuard],
    component: CasosListComponent,
  },
  {
    path: 'casos/:id',
    canActivate: [secretarioAbogadoGuard],
    component: CasosInformationDialogComponent,
  },
  {
    path: 'noticias-list',
    canActivate: [adminGuard],
    component: NoticiasListComponent,
  },

  {
    path: 'noticias-detalle/:id',
    component: NoticiaDetalleComponent,
  },

  {
    path: 'horarios-turnos',
    canActivate: [abogadoGuard],
    component: HorariosTurnosListComponent,
  },
  {
    path: 'mis-actividades',
    canActivate: [abogadoGuard],
    component: MisActividadesComponent,
  },
  {
    path: 'mis-turnos',
    canActivate: [abogadoGuard],
    component: TurnosListComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

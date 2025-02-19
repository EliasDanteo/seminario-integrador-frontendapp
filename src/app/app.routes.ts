import { Routes } from '@angular/router';
import { AbogadosListComponent } from './abogados-crud/abogados-list/abogados-list.component.js';
import { ClientesListComponent } from './clientes-crud/clientes-list/clientes-list.component.js';
import { SecretariosListComponent } from './secretarios-list/secretarios-list.component.js';

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
];

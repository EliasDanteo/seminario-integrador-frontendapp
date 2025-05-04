import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ICliente } from '../../../core/interfaces/ICliente.interface.js';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { environment } from '../../../../environments/environment.js';
import { CRUDDialogComponent } from '../../../shared/crud-dialog/crud-dialog.component.js';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component.js';
import { ClienteService } from '../../../core/services/cliente.service.js';
@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [HttpClientModule, MatButtonModule, FormsModule],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.css',
})
export class ClientesListComponent {
  clientes: ICliente[] | null = null;
  filteredClientes: ICliente[] | null = null;
  fullNameFilter: string = '';
  nroDocFilter: string = '';
  showCompanies: boolean = true;
  showPersons: boolean = true;

  constructor(
    public clientService: ClienteService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.loadClientes();
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadClientes();
      }
    });
  }

  applyFilters(): void {
    this.filteredClientes = this.clientes ? [...this.clientes] : [];

    if (this.fullNameFilter) {
      const filterText = this.normalizeText(this.fullNameFilter);
      this.filteredClientes = this.filteredClientes.filter((cliente) => {
        const fullName1 = this.normalizeText(
          `${cliente.apellido} ${cliente.nombre}`
        );
        const fullName2 = this.normalizeText(
          `${cliente.nombre} ${cliente.apellido}`
        );
        return fullName1.includes(filterText) || fullName2.includes(filterText);
      });
    }

    if (this.nroDocFilter) {
      this.filteredClientes = this.filteredClientes.filter((cliente) =>
        cliente.nro_doc.includes(this.nroDocFilter)
      );
    }

    this.filteredClientes = this.filteredClientes.filter((cliente) => {
      return (
        (this.showCompanies && cliente.es_empresa) ||
        (this.showPersons && !cliente.es_empresa)
      );
    });
  }

  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  loadClientes() {
    this.http
      .get<{ message: string; data: ICliente[] }>(environment.clientesUrl)
      .subscribe({
        next: (res) => {
          this.clientes = res.data;
          this.applyFilters();
        },
      });
  }

  openCreateDialog(): void {
    this.openDialog(CRUDDialogComponent, {
      title: 'Crear Cliente',
      action: 'post',
      entityType: 'cliente',
      crudService: this.clientService,
    });
  }
  openCreateDialogEmpresa(): void {
    this.openDialog(CRUDDialogComponent, {
      title: 'Crear Empresa',
      action: 'post',
      entityType: 'empresa',
      crudService: this.clientService,
    });
  }

  openEditDialog(cliente: ICliente, tipo: string): void {
    if (cliente) {
      this.openDialog(CRUDDialogComponent, {
        title: 'Actualizar ' + tipo,
        action: 'put',
        user: cliente,
        entityType: tipo,
        crudService: this.clientService,
      });
    } else {
      console.error('Cliente no disponible');
    }
  }

  deleteCliente(cliente: ICliente): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: `${cliente.nombre} ${cliente.apellido ?? ''}`.trim(),

        entidad: 'cliente',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarCliente(cliente);
      }
    });
  }

  eliminarCliente(cliente: ICliente): void {
    this.http
      .patch(`${environment.clientesUrl}/deactivate/${cliente.id}`, {})
      .subscribe({
        next: (response) => {
          this.loadClientes();
        },
        error: (err) => {
          console.error('Error al dar de baja el cliente', err);
          alert(
            'Hubo un error al dar de baja el cliente. Inténtalo nuevamente.'
          );
        },
      });
  }
}

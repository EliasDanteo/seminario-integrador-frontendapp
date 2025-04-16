import { Component } from '@angular/core';
import { ICaso } from '../../../core/interfaces/ICaso.interface.js';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { environment } from '../../../../environments/environment.js';
import { FormsModule } from '@angular/forms';
import { CasosInformationDialogComponent } from '../casos-information-dialog/casos-information-dialog.component.js';
import { CRUDDialogComponent } from '../../../shared/crud-dialog/crud-dialog.component.js';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component.js';
import { Router } from '@angular/router';
@Component({
  selector: 'app-casos-list',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './casos-list.component.html',
  styleUrl: './casos-list.component.css',
})
export class CasosListComponent {
  casos: ICaso[] | null = null;
  filteredCasos: ICaso[] | null = null;
  clienteFilter: string = '';
  estadoFilter: string = '';
  especialidadFilter: string = '';
  descripcionFilter: string = '';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.loadCasos();
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, { data });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadCasos();
      }
    });
  }

  showDetails(caso: ICaso): void {
    // Navegar a la ruta de detalle de caso y pasar los datos necesarios
    this.router.navigate(['/casos', caso.id]);
  }

  /*
  verCliente(cliente: any): void {
    alert(`Ver información del cliente: ${cliente.apellido} ${cliente.nombre}`);
  }
  */

  applyFilters(): void {
    this.filteredCasos = this.casos ? [...this.casos] : [];
    if (this.clienteFilter) {
      const filterText = this.normalizeText(this.clienteFilter);
      this.filteredCasos = this.filteredCasos.filter((caso) => {
        const fullName = this.normalizeText(
          `${caso.cliente.apellido} ${caso.cliente.nombre}`
        );
        return fullName.includes(filterText);
      });
    }
    if (this.estadoFilter) {
      const filterText = this.estadoFilter.trim().toLowerCase();
      this.filteredCasos = this.filteredCasos.filter(
        (caso) => caso.estado.trim().toLowerCase() === filterText
      );
    }
    if (this.especialidadFilter) {
      const filterText = this.especialidadFilter.trim().toLowerCase();
      this.filteredCasos = this.filteredCasos.filter(
        (caso) => caso.especialidad.nombre.trim().toLowerCase() === filterText
      );
    }
    if (this.descripcionFilter) {
      const filterText = this.normalizeText(this.descripcionFilter);
      this.filteredCasos = this.filteredCasos.filter((caso) =>
        this.normalizeText(caso.descripcion).includes(filterText)
      );
    }
  }

  normalizeText(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  loadCasos() {
    this.http
      .get<{ message: string; data: ICaso[] }>(environment.casosUrl)
      .subscribe({
        next: (res) => {
          this.casos = res.data;
          this.applyFilters();
        },
      });
  }

  openCreateDialog(): void {
    this.openDialog(CRUDDialogComponent, {
      action: 'post',
      entityType: 'caso',
      entity: null,
    });
  }

  openEditDialog(caso: ICaso): void {
    if (caso) {
      this.openDialog(CRUDDialogComponent, {
        action: 'put',
        entityType: 'caso',
        entity: caso,
      });
    }
  }

  deleteCaso(caso: ICaso): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: `${caso.cliente.nombre} ${caso.cliente.apellido}`,
        entidad: 'caso',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarCaso(caso);
      }
    });
  }

  eliminarCaso(caso: ICaso): void {
    this.http
      .patch(`${environment.casosUrl}/deactivate/${caso.id}`, {})
      .subscribe({
        next: () => this.loadCasos(),
        error: (err) => {
          console.error('Error al dar de baja el caso', err);
          alert('Hubo un error al dar de baja el caso. Inténtalo nuevamente.');
        },
      });
  }
}

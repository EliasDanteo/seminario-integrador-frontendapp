import { Component } from '@angular/core';
import { IAbogado } from '../../../core/interfaces/IAbogado.interface.js';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CRUDDialogComponent } from '../../../shared/crud-dialog/crud-dialog.component.js';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component.js';
import { AbogadoService } from '../../../core/services/abogados.service.js';
import { InformesDialogComponent } from '../../../shared/informes-dialog/informes-dialog.component.js';
import { AuthService } from '../../../core/services/auth.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-abogados-list',
  standalone: true,
  imports: [HttpClientModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './abogados-list.component.html',
  styleUrl: './abogados-list.component.css',
})
export class AbogadosListComponent {
  abogados: IAbogado[] | null = null;
  filteredAbogados: IAbogado[] | null = null;
  fullNameFilter: string = '';
  matriculaFilter: string = '';
  usuario: any = null;

  constructor(
    private dialog: MatDialog,
    private abogadoService: AbogadoService,
    private authService: AuthService
  ) {
    this.usuario = this.authService.getUser();
    this.loadAbogados();
  }
  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadAbogados();
      }
    });
  }

  applyFilters(): void {
    this.filteredAbogados = this.abogados ? [...this.abogados] : [];

    if (this.fullNameFilter) {
      const filterText = this.normalizeText(this.fullNameFilter);

      this.filteredAbogados = this.filteredAbogados.filter((abogado) => {
        const fullName1 = this.normalizeText(
          `${abogado.apellido} ${abogado.nombre}`
        );
        const fullName2 = this.normalizeText(
          `${abogado.nombre} ${abogado.apellido}`
        );

        return fullName1.includes(filterText) || fullName2.includes(filterText);
      });
    }
    if (this.matriculaFilter) {
      this.filteredAbogados = this.filteredAbogados.filter((abogado) =>
        abogado.matricula.includes(this.matriculaFilter)
      );
    }
  }
  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  loadAbogados() {
    this.abogadoService.getAll().subscribe({
      next: (response) => {
        this.abogados = response.data;
        this.filteredAbogados = [...this.abogados];
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error al cargar los abogados', err);
        alert('Hubo un error al cargar los abogados. Inténtalo nuevamente.');
      },
    });
  }

  openCreateDialog(): void {
    this.openDialog(CRUDDialogComponent, {
      title: 'Crear Abogado',
      action: 'post',
      entityType: 'abogado',
      crudService: this.abogadoService,
    });
  }

  openEditDialog(abogado: IAbogado): void {
    if (abogado) {
      this.openDialog(CRUDDialogComponent, {
        title: 'Actualizar Abogado',
        action: 'put',
        user: abogado,
        entityType: 'abogado',
        crudService: this.abogadoService,
      });
    } else {
      console.error('Abogado no disponible');
    }
  }
  deleteAbogado(abogado: IAbogado): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: abogado.nombre,
        entidad: 'abogado',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarAbogado(abogado);
      }
    });
  }
  eliminarAbogado(abogado: IAbogado): void {
    this.abogadoService.deactivate(abogado.id).subscribe({
      next: () => {
        this.loadAbogados();
      },
      error: (err) => {
        console.error('Error al eliminar el abogado', err);
        alert('Hubo un error al eliminar el abogado. Inténtalo nuevamente.');
      },
    });
  }

  openInformeDesempenioDialog(): void {
    this.openDialog(InformesDialogComponent, {
      informeType: 'desempenio',
      caso: null,
    });
  }
}

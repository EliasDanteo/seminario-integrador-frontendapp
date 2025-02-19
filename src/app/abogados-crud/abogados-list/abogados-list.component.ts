import { Component } from '@angular/core';
import IAbogado from '../../core/interfaces/IAbogado.interface.js';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.js';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CRUDDialogComponent } from '../../shared/crud-dialog/crud-dialog.component.js';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component.js';

@Component({
  selector: 'app-abogados-list',
  standalone: true,
  imports: [HttpClientModule, MatButtonModule, FormsModule],
  templateUrl: './abogados-list.component.html',
  styleUrl: './abogados-list.component.css',
})
export class AbogadosListComponent {
  abogados: IAbogado[] | null = null;
  filteredAbogados: IAbogado[] | null = null;
  fullNameFilter: string = '';
  matriculaFilter: string = '';

  constructor(private http: HttpClient, private dialog: MatDialog) {
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
    this.http
      .get<{ message: string; data: IAbogado[] }>(environment.abogadosUrl)
      .subscribe({
        next: (res) => {
          this.abogados = res.data;
          console.log('Abogados cargados:', this.abogados);
          this.applyFilters();
        },
      });
  }

  openCreateDialog(): void {
    this.openDialog(CRUDDialogComponent, {
      action: 'post',
      entityType: 'abogado',
      entity: null,
    });
  }

  openEditDialog(abogado: IAbogado): void {
    if (abogado) {
      console.log('Abogado a editar:', abogado);
      this.openDialog(CRUDDialogComponent, {
        action: 'put',
        entityType: 'abogado',
        entity: abogado,
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
    this.http
      .patch(`${environment.abogadosUrl}/deactivate/${abogado.id}`, {})
      .subscribe({
        next: (response) => {
          this.loadAbogados();
        },
        error: (err) => {
          console.error('Error al dar de baja el abogado', err);
          alert(
            'Hubo un error al dar de baja el abogado. Inténtalo nuevamente.'
          );
        },
      });
  }
}

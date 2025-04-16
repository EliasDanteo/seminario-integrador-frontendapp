import { Component } from '@angular/core';
import { ISecretario } from '../core/interfaces/ISecretario.interface.js';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { environment } from '../../environments/environment.js';
import { CRUDDialogComponent } from '../shared/crud-dialog/crud-dialog.component.js';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component.js';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-secretarios-list',
  standalone: true,
  imports: [HttpClientModule, MatButtonModule, FormsModule],
  templateUrl: './secretarios-list.component.html',
  styleUrl: './secretarios-list.component.css',
})
export class SecretariosListComponent {
  secretarios: ISecretario[] | null = null;
  filteredSecretarios: ISecretario[] | null = null;
  fullNameFilter: string = '';
  nroDocFilter: string = '';

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.loadSecretarios();
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, { data });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadSecretarios();
      }
    });
  }

  applyFilters(): void {
    this.filteredSecretarios = this.secretarios ? [...this.secretarios] : [];

    if (this.fullNameFilter) {
      const filterText = this.normalizeText(this.fullNameFilter);
      this.filteredSecretarios = this.filteredSecretarios.filter(
        (secretario) => {
          const fullName = this.normalizeText(
            `${secretario.nombre} ${secretario.apellido}`
          );
          return fullName.includes(filterText);
        }
      );
    }

    if (this.nroDocFilter) {
      this.filteredSecretarios = this.filteredSecretarios.filter((secretario) =>
        secretario.nro_doc.includes(this.nroDocFilter)
      );
    }
  }

  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  loadSecretarios() {
    this.http
      .get<{ message: string; data: ISecretario[] }>(environment.secretariosUrl)
      .subscribe({
        next: (res) => {
          this.secretarios = res.data;
          this.applyFilters();
        },
      });
  }

  openCreateDialog(): void {
    this.openDialog(CRUDDialogComponent, {
      action: 'post',
      entityType: 'secretario',
      entity: null,
    });
  }

  openEditDialog(secretario: ISecretario): void {
    if (secretario) {
      this.openDialog(CRUDDialogComponent, {
        action: 'put',
        entityType: 'secretario',
        entity: secretario,
      });
    }
  }

  deleteSecretario(secretario: ISecretario): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: `${secretario.nombre} ${
          secretario.apellido ?? ''
        }`.trim(),
        entidad: 'secretario',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarSecretario(secretario);
      }
    });
  }

  eliminarSecretario(secretario: ISecretario): void {
    this.http
      .patch(`${environment.secretariosUrl}/deactivate/${secretario.id}`, {})
      .subscribe({
        next: () => this.loadSecretarios(),
        error: (err) =>
          alert('Error al eliminar secretario, intenta nuevamente.'),
      });
  }
}

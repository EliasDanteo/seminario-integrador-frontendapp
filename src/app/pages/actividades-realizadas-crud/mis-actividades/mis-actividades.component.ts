import { Component, OnInit } from '@angular/core';
import { ActividadesAbogadoService } from '../../../core/services/actividades-abogado.service.js';
import { SnackbarService } from '../../../core/services/snackbar.service.js';
import { IActividadRealizada } from '../../../core/interfaces/IActividad-realizada.interface.js';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { MisActividadesDialogComponent } from '../mis-actividades-dialog/mis-actividades-dialog.component.js';
import { AuthService } from '../../../core/services/auth.service.js';
import { ICliente } from '../../../core/interfaces/ICliente.interface.js';
import { ISecretario } from '../../../core/interfaces/ISecretario.interface.js';
import { IAbogado } from '../../../core/interfaces/IAbogado.interface.js';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-actividades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-actividades.component.html',
  styleUrl: './mis-actividades.component.css',
})
export class MisActividadesComponent implements OnInit {
  actividadesRealizadas: IActividadRealizada[] = [];
  filteredActividadesRealizadas: IActividadRealizada[] = [];
  idAbogado: any;
  user: ICliente | ISecretario | IAbogado | null = null;

  // Filtros
  actividadFilter: string = '';
  clienteFilter: string = '';

  constructor(
    private actividadesAbogadoService: ActividadesAbogadoService,
    private snackBarService: SnackbarService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
    if (this.user) {
      this.idAbogado = this.user.id;
    }
  }

  ngOnInit(): void {
    this.loadActividadesAbogado(this.idAbogado);
  }

  loadActividadesAbogado(id_abogado: number) {
    this.actividadesAbogadoService.getActividadesAbogado(id_abogado).subscribe({
      next: (response) => {
        this.actividadesRealizadas = response.data;
        this.filteredActividadesRealizadas = [...this.actividadesRealizadas];
        this.applyFilters();
      },
      error: () => {
        this.snackBarService.showError(
          'Error al cargar las actividades del abogado'
        );
      },
    });
  }

  applyFilters(): void {
    this.filteredActividadesRealizadas = [...this.actividadesRealizadas];

    // Filtro por nombre de actividad
    if (this.actividadFilter) {
      const filterText = this.normalizeText(this.actividadFilter);
      this.filteredActividadesRealizadas =
        this.filteredActividadesRealizadas.filter((ar) =>
          this.normalizeText(ar.actividad.nombre).includes(filterText)
        );
    }

    // Filtro por nombre/apellido de cliente
    if (this.clienteFilter) {
      const filterText = this.normalizeText(this.clienteFilter);
      this.filteredActividadesRealizadas =
        this.filteredActividadesRealizadas.filter((ar) => {
          const nombreCompleto = this.normalizeText(
            `${ar.cliente.nombre} ${ar.cliente.apellido}`
          );
          const apellidoNombre = this.normalizeText(
            `${ar.cliente.apellido} ${ar.cliente.nombre}`
          );
          return (
            nombreCompleto.includes(filterText) ||
            apellidoNombre.includes(filterText)
          );
        });
    }
  }

  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadActividadesAbogado(this.idAbogado);
      }
    });
  }

  onUpdate(actividad: IActividadRealizada) {
    this.openDialog(MisActividadesDialogComponent, {
      action: 'update',
      actividad: actividad,
    });
  }

  onDelete(actividad: IActividadRealizada): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: actividad.actividad.nombre,
        entidad: 'actividad',
        femenino: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.actividadesAbogadoService.deleteActividad(actividad.id).subscribe({
          next: (response) => {
            this.loadActividadesAbogado(this.idAbogado);
          },
          error: (err) => {
            if (err.error.isUserFriendly) {
              this.snackBarService.showError(err.error.message);
            } else
              this.snackBarService.showError('Error al eliminar la actividad');
          },
        });
      }
    });
  }

  onCreate() {
    this.openDialog(MisActividadesDialogComponent, {
      action: 'create',
      actividad: null,
    });
  }
}

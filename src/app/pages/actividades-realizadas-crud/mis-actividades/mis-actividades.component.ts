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

@Component({
  selector: 'app-mis-actividades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-actividades.component.html',
  styleUrl: './mis-actividades.component.css',
})
export class MisActividadesComponent implements OnInit {
  actividadesRealizadas: IActividadRealizada[] = [];
  idAbogado: any;
  user: ICliente | ISecretario | IAbogado | null = null;

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

  ngOnInit(): void {
    this.loadActividadesAbogado(this.idAbogado);
  }

  loadActividadesAbogado(id_abogado: number) {
    this.actividadesAbogadoService.getActividadesAbogado(id_abogado).subscribe({
      next: (response) => {
        this.actividadesRealizadas = response.data;
      },
      error: () => {
        this.snackBarService.showError(
          'Error al cargar las actividades del abogado'
        );
      },
    });
  }

  onUpdate(actividad: IActividadRealizada) {
    this.openDialog(MisActividadesDialogComponent, {
      action: 'update',
      actividad: actividad,
    });
  }

  onDelete(actividad: IActividadRealizada) {
    this.openDialog(MisActividadesDialogComponent, {
      action: 'delete',
      actividad: actividad,
    });
  }

  onCreate() {
    this.openDialog(MisActividadesDialogComponent, {
      action: 'create',
      actividad: null,
    });
  }
}

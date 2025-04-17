import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IActividad } from '../../../core/interfaces/IActividad.interface.js';
import { environment } from '../../../../environments/environment.js';
import { ComponentType } from '@angular/cdk/portal';
import { ActividadDialogComponent } from '../actividad-dialog/actividad-dialog.component.js';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component.js';
import { CommonModule } from '@angular/common';
import { JusDialogComponent } from '../../jus-dialog/jus-dialog.component.js';

@Component({
  selector: 'app-actividades-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './actividades-list.component.html',
  styleUrl: './actividades-list.component.css',
})
export class ActividadesListComponent {
  actividades: IActividad[] | null = null;

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.getActividades();
  }

  getActividades() {
    this.http
      .get<{
        message: string;
        data: IActividad[];
      }>(environment.actividadesUrl)
      .subscribe({
        next: (res) => {
          this.actividades = res.data;
        },
      });
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, { data: data });

    dialogRef.afterClosed().subscribe((res) => {
      if (res !== 'none') {
        this.getActividades();
      }
    });
  }

  openCreateDialog(): void {
    this.openDialog(ActividadDialogComponent, {
      action: 'post',
      entityType: 'actividad',
      entity: null,
      actividades: this.actividades || [],
    });
  }

  openEditDialog(act: IActividad, type: string): void {
    if (act) {
      this.openDialog(ActividadDialogComponent, {
        action: 'put',
        entityType: 'actividad',
        entity: act,
        type: type,
        actividades: this.actividades || [],
      });
    }
  }

  openJusDialog(): void {
    this.openDialog(JusDialogComponent, {});
  }

  deleteActividad(act: IActividad): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: act.nombre,
        entidad: 'actividad',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.eliminarActividad(act);
      }
    });
  }

  eliminarActividad(act: IActividad): void {
    this.http
      .patch(environment.actividadesUrl + '/' + act.id + '/deactivate/', {})
      .subscribe({
        next: () => {
          this.getActividades();
        },
        error: (err) => {
          console.error('Error al dar de baja la actividad', err);
          alert(
            'Hubo un error al dar de baja la actividad. Intentelo nuevamente.'
          );
        },
      });
  }
}

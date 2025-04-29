import { Component } from '@angular/core';
import { IHorarioTurno } from '../../../core/interfaces/IHorarioTurno.interface.js';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment.js';
import { ComponentType } from '@angular/cdk/portal';
import { HorariosTurnosDialogComponent } from '../horarios-turnos-dialog/horarios-turnos-dialog.component.js';
import { HorarioTurnoService } from '../../../core/services/horarioTurno.service.js';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component.js';
import { AuthService } from '../../../core/services/auth.service.js';

@Component({
  selector: 'app-horarios-turnos-list',
  standalone: true,
  imports: [],
  templateUrl: './horarios-turnos-list.component.html',
  styleUrl: './horarios-turnos-list.component.css',
})
export class HorariosTurnosListComponent {
  horarios: IHorarioTurno[] | null = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private horarioTurnoService: HorarioTurnoService,
    private authService: AuthService
  ) {
    this.getHorariosTurnos();
  }

  getHorariosTurnos() {
    this.http
      .get<any>(
        environment.turnosUrl +
          '/horarios/abogados/' +
          this.authService.getUser()?.id
      )
      .subscribe({
        next: (res) => {
          this.horarios = res.data.sort(
            (a: IHorarioTurno, b: IHorarioTurno) => {
              if (a.dia_semana !== b.dia_semana) {
                return a.dia_semana - b.dia_semana;
              }
              return a.hora_inicio.localeCompare(b.hora_inicio);
            }
          );
        },
        error: (err) => {
          console.error('Error', err);
        },
      });
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, { data: data });

    dialogRef.afterClosed().subscribe((res) => {
      if (res !== 'none') {
        this.getHorariosTurnos();
      }
    });
  }

  openCreateDialog(): void {
    this.openDialog(HorariosTurnosDialogComponent, {
      action: 'post',
      entityType: 'horarioTurno',
      entity: null,
      horarios: this.horarios || [],
    });
  }

  openEditDialog(hor: IHorarioTurno): void {
    if (hor) {
      this.openDialog(HorariosTurnosDialogComponent, {
        action: 'put',
        entityType: 'horarioTurno',
        entity: hor,
        horarios: this.horarios || [],
      });
    }
  }

  deleteHorarioTurno(hor: IHorarioTurno): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: `Dia: ${hor.dia_semana}\nInicio: ${hor.hora_inicio}\nFin: ${hor.hora_fin}`,
        entidad: 'horarioTurno',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.eliminarHorarioTurno(hor);
      }
    });
  }

  eliminarHorarioTurno(hor: IHorarioTurno): void {
    this.horarioTurnoService.deactivate(hor.id).subscribe({
      next: () => this.getHorariosTurnos(),
      error: (err) => {
        console.error('Hubo un error al eliminar el horario de turno.', err);
        alert(
          'Hubo un error al eliminar el horario de turno. Intentelo nuevamente.'
        );
      },
    });
  }
}

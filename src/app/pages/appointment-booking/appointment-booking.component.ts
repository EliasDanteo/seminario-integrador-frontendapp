import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '../../core/services/snackbar.service.js';
import {
  ITurnoOtorgadoCreate,
  turnoOtorgadoService,
} from '../../core/services/turnoOtorgado.service.js';
import { HorarioTurnoService } from '../../core/services/horarioTurno.service.js';
import { IHorarioTurno } from '../../core/interfaces/IHorarioTurno.interface.js';
import { IAbogado } from '../../core/interfaces/IAbogado.interface.js';
import { AuthService } from '../../core/services/auth.service.js';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MensajeDialogComponent } from '../../shared/mensaje-dialog/mensaje-dialog.component.js';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './appointment-booking.component.html',
  styleUrl: './appointment-booking.component.css',
})
export class AppointmentBookingComponent {
  form = new FormGroup({
    fechaTurno: new FormControl(null as Date | null, [Validators.required]),
    abogado: new FormControl(
      {} as Pick<IAbogado, 'id' | 'nombre' | 'apellido'>,
      [Validators.required]
    ),
    horarioTurno: new FormControl<IHorarioTurno | null>(null, [
      Validators.required,
    ]),
    nombre: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  user: any = null;

  constructor(
    private snackBarService: SnackbarService,
    private turnoOtorgadoService: turnoOtorgadoService,
    private horariosTurnoService: HorarioTurnoService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {
    this.user = this.auth.getUser();
    if (this.user) {
      this.form.controls.nombre.setValue(this.user.nombre);
      this.form.controls.email.setValue(this.user.email);
      this.form.controls.telefono.clearValidators();
      this.form.controls.email.clearValidators();
      this.form.controls.telefono.updateValueAndValidity();
      this.form.controls.email.updateValueAndValidity();

      (this.form as FormGroup<any>).addControl(
        'id_cliente',
        new FormControl(this.user.id)
      );
    }
  }

  abogadosDisponibles: Array<Pick<IAbogado, 'id' | 'nombre' | 'apellido'>> = [];
  horariosDisponibles: IHorarioTurno[] = [];
  turnosDisponbiles: IHorarioTurno[] = [];

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  validateIfClient() {
    if (this.user && this.user.tipo_usuario === 'cliente') {
      this.form.controls.nombre.setValue(this.user.nombre);
      this.form.controls.telefono.clearValidators();
      this.form.controls.email.clearValidators();
      this.form.controls.telefono.updateValueAndValidity();
      this.form.controls.email.updateValueAndValidity();
    } else {
      this.form.controls.telefono.setValidators([Validators.required]);
      this.form.controls.email.setValidators([
        Validators.required,
        Validators.email,
      ]);
    }
  }

  onAbogadoSelected(event: Event): void {
    if (this.form.value.abogado && this.form.value.fechaTurno) {
      this.loadHorariosDisponibles(
        this.form.value.fechaTurno.toString(),
        this.form.value.abogado.id
      );
    }
  }

  onDateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.snackBarService.showError('La fecha no puede ser anterior a hoy');
      this.form.controls.fechaTurno.setValue(new Date());
      return;
    }
    this.form.controls.horarioTurno.setValue(null);
    this.form.controls.abogado.setValue(null);
    this.loadAbogadosDisponbiles(input.value);
  }

  loadAbogadosDisponbiles(fecha: string): void {
    this.horariosTurnoService.getDisponibles(fecha).subscribe({
      next: (response) => {
        this.form.controls.horarioTurno.setValue(null);
        this.turnosDisponbiles = response.data || [];
        this.abogadosDisponibles = this.turnosDisponbiles.map(
          (horario) => horario.abogado
        );

        this.abogadosDisponibles = this.abogadosDisponibles.filter(
          (abogado, index, self) =>
            index ===
            self.findIndex(
              (a) =>
                a.nombre === abogado.nombre && a.apellido === abogado.apellido
            )
        );

        if (this.turnosDisponbiles.length === 0) {
          this.dialog.open(MensajeDialogComponent, {
            data: {
              mensaje: 'No hay turnos disponibles para la fecha seleccionada',
            },
          });
        }
      },
      error: (err) => {
        this.snackBarService.showError(
          err.error.isUserFriendly
            ? err.error.message
            : 'Error al cargar los abogados'
        );
      },
    });
  }

  loadHorariosDisponibles(fecha: string, abogadoId: string) {
    this.horariosTurnoService.getDisponibles(fecha, abogadoId).subscribe({
      next: (response) => {
        this.horariosDisponibles = response.data || [];

        if (this.horariosDisponibles.length === 0) {
          this.snackBarService.showError(
            'No hay horarios disponibles para la fecha seleccionada'
          );
        }
      },
      error: (err) => {
        this.snackBarService.showError(
          err.error.isUserFriendly
            ? err.error.message
            : 'Error al cargar los horarios'
        );
      },
    });
  }
  compareHorarios(
    horario1: IHorarioTurno | null,
    horario2: IHorarioTurno | null
  ): boolean {
    return horario1?.id === horario2?.id;
  }

  formatHorario(horario: IHorarioTurno): string {
    return ` ${horario.hora_inicio.substring(
      0,
      5
    )} a ${horario.hora_fin.substring(0, 5)}`;
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      let turnoData: Partial<ITurnoOtorgadoCreate> = {
        id_horario_turno: formData.horarioTurno?.id.toString(),
        fecha_turno: formData.fechaTurno?.toString(),
      };

      if (this.user && this.user.tipo_usuario === 'cliente') {
        turnoData = {
          ...turnoData,
          id_cliente: this.user.id,
        };
      } else {
        if (formData.nombre && formData.telefono && formData.email) {
          turnoData = {
            ...turnoData,
            nombre: formData.nombre as string,
            telefono: formData.telefono as string,
            email: formData.email as string,
          };
        } else {
          this.snackBarService.showError(
            'Faltan completar nombre, teléfono o email.'
          );
          return;
        }
      }
      this.turnoOtorgadoService
        .create(turnoData as ITurnoOtorgadoCreate)
        .subscribe({
          next: (response) => {
            this.snackBarService.showSuccess(
              'Turno creado. Se enviaron los detalles al email.'
            );
            this.form.reset();
            this.validateIfClient();
            this.horariosDisponibles = [];
            this.abogadosDisponibles = [];
            this.turnosDisponbiles = [];
          },
          error: (err) => {
            this.snackBarService.showError(
              err.error.isUserFriendly
                ? err.error.message
                : 'Error al crear el turno'
            );
          },
        });
    }
  }
}

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

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './appointment-booking.component.html',
  styleUrl: './appointment-booking.component.css',
})
export class AppointmentBookingComponent {
  form = new FormGroup({
    fechaTurno: new FormControl(Date, [Validators.required]),
    abogado: new FormControl(
      {} as Pick<IAbogado, 'id' | 'nombre' | 'apellido'>,
      [Validators.required]
    ),
    horarioTurno: new FormControl<IHorarioTurno | null>(null, [
      Validators.required,
    ]),
    nombre: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private snackBarService: SnackbarService,
    private turnoOtorgadoService: turnoOtorgadoService,
    private horariosTurnoService: HorarioTurnoService
  ) {
    //en el constructor si el cliente se encuentra logueado se le carga el id_cliente al form y se saca nombre, telefono y email
  }

  abogadosDisponibles: Array<Pick<IAbogado, 'id' | 'nombre' | 'apellido'>> = [];
  horariosDisponibles: IHorarioTurno[] = [];
  turnosDisponbiles: IHorarioTurno[] = [];

  get today(): string {
    return new Date().toISOString().split('T')[0];
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
      this.form.controls.fechaTurno.setValue(Date);
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
          this.snackBarService.showError(
            'No hay abogados disponibles para la fecha seleccionada'
          );
        }
      },
      error: (error) => {
        this.snackBarService.showError(
          'Error al cargar los abogados disponibles'
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
      error: (error) => {
        this.snackBarService.showError(
          'Error al cargar los horarios disponibles'
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
      const turnoData = {
        id_horario_turno: formData.horarioTurno?.id.toString(),
        fecha_turno: formData.fechaTurno?.toString(),
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
      };
      this.turnoOtorgadoService
        .create(turnoData as ITurnoOtorgadoCreate)
        .subscribe({
          next: (response) => {
            this.snackBarService.showSuccess('Turno creado con éxito.');
            this.form.reset();
          },
          error: (error) => {
            this.snackBarService.showError('Error al crear el turno.');
          },
        });
    }
  }
}

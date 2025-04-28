import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SnackbarService } from '../../../core/services/snackbar.service.js';
import { catchError, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { environment } from '../../../../environments/environment.js';
import { AuthService } from '../../../core/services/auth.service.js';

@Component({
  selector: 'app-horarios-turnos-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './horarios-turnos-dialog.component.html',
  styleUrl: './horarios-turnos-dialog.component.css',
})
export class HorariosTurnosDialogComponent {
  entityForm: FormGroup;
  isEdit: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: string;
      entityType: 'horarioTurno';
      entity: any;
      horarios?: any[];
    },
    public dialogRef: MatDialogRef<HorariosTurnosDialogComponent>,
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {
    this.entityForm = new FormGroup({
      id_abogado: new FormControl(Number(this.authService.getUser()?.id), [
        Validators.required,
      ]),
      dia_semana: new FormControl(null, [Validators.required]),
      hora_inicio: new FormControl(null, [Validators.required]),
      hora_fin: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.data.action === 'put' && this.data.entity) {
      this.entityForm.patchValue(this.data.entity);
      this.isEdit = true;
    }
  }

  onSubmit(): void {
    if (this.entityForm.valid) {
      const formData = {
        ...this.entityForm.value,
      };

      if (this.entityForm.value.hora_inicio >= this.entityForm.value.hora_fin) {
        this.snackbarService.showError(
          'La hora de inicio debe ser menor que la hora de fin.',
          5000
        );
        return;
      }

      const haySolapamiento = this.data.horarios?.some(
        (hor) =>
          hor.dia_semana === formData.dia_semana &&
          hor.id !== this.data.entity?.id && // para ignorar el horario que se esta editando
          hor.hora_inicio < formData.hora_fin &&
          formData.hora_inicio < hor.hora_fin
      );

      if (haySolapamiento) {
        this.snackbarService.showError(
          'No es posible agregar ese horario, coincide con uno ya existente.',
          5000
        );
        return;
      }

      if (
        this.data.action === 'put' &&
        this.data.entity.dia_semana === this.entityForm.value.dia_semana &&
        this.data.entity.hora_inicio === this.entityForm.value.hora_inicio &&
        this.data.entity.hora_fin === this.entityForm.value.hora_fin
      ) {
        this.snackbarService.showError(
          'El nuevo horario debe ser distinto al actual.',
          5000
        );
        return;
      }

      if (this.data.action === 'post') {
        this.http
          .post<any>(environment.turnosUrl + '/horarios/', formData)
          .pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe({
            next: (res) => {
              this.snackbarService.showSuccess('¡Creación exitosa!', 5000);
              this.dialogRef.close(res);
            },
          });
      } else if (this.data.action === 'put' && this.data.entity?.id) {
        this.http
          .put<any>(
            environment.turnosUrl + '/horarios/' + this.data.entity.id,
            formData
          )
          .pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe({
            next: (res) => {
              this.snackbarService.showSuccess('¡Actualización exitosa!', 5000);
              this.dialogRef.close(res);
            },
          });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close('none');
  }
}

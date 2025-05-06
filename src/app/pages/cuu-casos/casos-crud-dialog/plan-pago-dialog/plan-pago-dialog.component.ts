import { Component, Inject } from '@angular/core';
import {
  ICaso,
  IFinalizarCaso,
} from '../../../../core/interfaces/ICaso.interface.js';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CasosService } from '../../../../core/services/casos.service.js';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { SnackbarService } from '../../../../core/services/snackbar.service.js';

@Component({
  selector: 'app-plan-pago-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatOptionModule,
  ],
  templateUrl: './plan-pago-dialog.component.html',
  styleUrl: './plan-pago-dialog.component.css',
})
export class PlanPagoDialogComponent {
  planPagoForm: FormGroup;
  currentDate = new Date();
  frecuenciasPago: string[] = [
    'Semanal',
    'Quincenal',
    'Mensual',
    'Semestral',
    'Trimestral',
    'Anual',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { caso: ICaso },
    private casoService: CasosService,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<PlanPagoDialogComponent>
  ) {
    this.planPagoForm = new FormGroup({
      cant_jus: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(999),
      ]),
      fecha_primer_cobro: new FormControl('', [
        Validators.required,
        this.minDateValidator(this.currentDate),
      ]),
      frecuencia_cobro: new FormControl('', [Validators.required]),
      num_cuotas: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(12),
      ]),
    });
  }

  minDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      return selectedDate < minDate ? { minDate: true } : null;
    };
  }

  onSubmit(): void {
    if (this.planPagoForm.valid) {
      const planPago: IFinalizarCaso = {
        cant_jus: this.planPagoForm.value.cant_jus,
        fecha_primer_cobro: this.planPagoForm.value.fecha_primer_cobro,
        frecuencia_cobro: this.planPagoForm.value.frecuencia_cobro,
        num_cuotas: this.planPagoForm.value.num_cuotas,
      };
      this.casoService.finalizarCaso(this.data.caso.id, planPago).subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(
            'Caso finalizado correctamente. Plan de pago creado exitosamente.'
          );
          this.onClose();
        },
        error: (err) => {
          if (err.error.isUserFriendly) {
            this.snackBarService.showError(err.error.message);
          } else {
            this.snackBarService.showError(
              'Error al finalizar el caso. Por favor, intente nuevamente.'
            );
          }
          this.onClose();
        },
      });
    } else {
      this.snackBarService.showError('Formulario invalido');
    }
  }

  onClose() {
    this.planPagoForm.reset();
    this.dialogRef.close(true);
  }
}

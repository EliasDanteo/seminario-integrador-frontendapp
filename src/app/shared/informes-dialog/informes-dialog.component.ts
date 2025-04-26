import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { InformesService } from '../../core/services/informes.service.js';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { IAbogado } from '../../core/interfaces/IAbogado.interface.js';
import { AbogadoService } from '../../core/services/abogados.service.js';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { IInforme } from '../../core/interfaces/IInforme.interface.js';
import { ICaso } from '../../core/interfaces/ICaso.interface.js';
import { SnackbarService } from '../../core/services/snackbar.service.js';

@Component({
  selector: 'app-informes-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
  ],
  templateUrl: './informes-dialog.component.html',
  styleUrl: './informes-dialog.component.css',
})
export class InformesDialogComponent implements OnInit {
  informeForm: FormGroup;
  currentMonth: string;
  abogados: IAbogado[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { informeType: string; caso: ICaso | null },
    private informesService: InformesService,
    private abogadosService: AbogadoService,
    private dialogRef: MatDialogRef<InformesDialogComponent>,
    private snackBarService: SnackbarService
  ) {
    const today = new Date();
    this.currentMonth = today.toISOString().split('T')[0].substring(0, 7);
    this.informeForm = new FormGroup({
      mes: new FormControl('', [
        Validators.required,
        this.maxMonthValidator(this.currentMonth),
      ]),
    });
  }

  ngOnInit(): void {
    if (this.data.informeType === 'desempenio') {
      this.cargarAboogados();
      this.informeForm.patchValue({
        id_abogado: new FormControl('', [Validators.required]),
      });
    }
  }

  cargarAboogados() {
    this.abogadosService.getAll().subscribe({
      next: (response) => {
        this.abogados = response.data;
      },
      error: (error) => {
        console.error('Error al obtener abogados:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.informeForm.valid) {
      const informeData: IInforme = {
        mes: this.informeForm.value.mes,
        id_abogado:
          this.data.informeType === 'desempenio'
            ? this.informeForm.value.id_abogado
            : undefined,
      };
      switch (this.data.informeType) {
        case 'ingresos':
          this.informesService.solicitarInformeIngresos(informeData).subscribe({
            next: (response) => {
              if (response) {
                this.snackBarService.showSuccess(
                  'Informe de ingresos solicitado correctamente'
                );
              } else {
                this.snackBarService.showError(
                  'Error al solicitar informe de ingresos'
                );
              }
            },
            error: () => {
              this.snackBarService.showError(
                'Error al solicitar informe de ingresos'
              );
            },
          });
          break;
        case 'desempenio':
          this.informesService
            .solicitarInformeDesempenio(informeData)
            .subscribe({
              next: (response) => {
                if (response) {
                  this.snackBarService.showSuccess(
                    'Informe de desempeño solicitado correctamente'
                  );
                } else {
                  this.snackBarService.showError(
                    'Error al solicitar informe de desempeño'
                  );
                }
              },
              error: () => {
                this.snackBarService.showError(
                  'Error al solicitar informe de desempeño'
                );
              },
            });
          break;
        case 'caso':
          this.informesService
            .solicitarInformeCaso(this.data.caso!.id)
            .subscribe({
              next: (response) => {
                if (response) {
                  this.snackBarService.showSuccess(
                    'Informe de caso solicitado correctamente'
                  );
                } else {
                  this.snackBarService.showError(
                    'Error al solicitar informe de caso'
                  );
                }
              },
              error: () => {
                this.snackBarService.showError(
                  'Error al solicitar informe de caso'
                );
              },
            });
          break;
        default:
          console.error('Tipo de informe no válido');
      }
      this.dialogRef.close();
    }
  }

  maxMonthValidator(maxMonth: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const val: string = control.value;
      if (!val) return null;
      return val > maxMonth ? { maxMonth: true } : null;
    };
  }
}

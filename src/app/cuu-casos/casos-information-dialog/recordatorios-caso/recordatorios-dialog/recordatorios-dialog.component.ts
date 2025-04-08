import { Component, Inject, OnInit } from '@angular/core';
import { SnackbarService } from '../../../../services/snackbar.service.js';
import { HttpClient } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { IRecordatorio } from '../../../../core/interfaces/IRecordatorio.interface.js';
import { ICaso } from '../../../../core/interfaces/ICaso.interface.js';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../../environments/environment.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recordatorios-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    CommonModule,
    MatDatepickerModule,
    FormsModule,
  ],
  templateUrl: './recordatorios-dialog.component.html',
  styleUrl: './recordatorios-dialog.component.css',
})
export class RecordatoriosDialogComponent {
  recordatorioForm: FormGroup;
  minDate: Date;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<RecordatoriosDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: string;
      caso: ICaso;
      recordatorio: IRecordatorio;
    }
  ) {
    this.recordatorioForm = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      fecha_limite: new FormControl('', [
        Validators.required,
        Validators.min(new Date().getDay()),
      ]),
      hora_limite: new FormControl('', [
        Validators.required,
        Validators.min(new Date().getHours()),
      ]),
    });
    this.minDate = new Date();
  }

  ngOnInit(): void {
    if (this.data.action === 'put') {
      this.recordatorioForm.patchValue({
        descripcion: this.data.recordatorio.descripcion,
        fecha_hora_limite: new Date(this.data.recordatorio.fecha_hora_limite),
      });
    }
  }

  onSubmit(): void {
    if (this.recordatorioForm.valid) {
      const recordatorio = {
        ...this.recordatorioForm.value,
        id_caso: this.data.caso.id,
        id_abogado: (() => {
          const abogado = localStorage.getItem('abogado');
          return abogado ? JSON.parse(abogado).id : null;
        })(),
      };
      if (this.data.action === 'post') {
        this.httpClient
          .post<{ message: string; data: IRecordatorio }>(
            `${environment.casosUrl}/recordatorios/${this.data.caso.id}`,
            recordatorio
          )
          .subscribe({
            next: (response) => {
              this.snackBarService.showSuccess(response.message);
              this.dialogRef.close(response.data);
            },
            error: () => {
              this.snackBarService.showError('Error al agregar recordatorio');
            },
          });
      } else if (this.data.action === 'put') {
        this.httpClient
          .put<{ message: string; data: IRecordatorio }>(
            `${environment.casosUrl}/recordatorios/${this.data.recordatorio.id}`,
            recordatorio
          )
          .subscribe({
            next: (response) => {
              this.snackBarService.showSuccess(response.message);
              this.dialogRef.close(response.data);
            },
            error: () => {
              this.snackBarService.showError('Error al editar recordatorio');
            },
          });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}

import { Component, Inject } from '@angular/core';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { HttpClient } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { IRecordatorio } from '../../../../../core/interfaces/IRecordatorio.interface.js';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../../../environments/environment.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service.js';

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
    FormsModule,
  ],
  templateUrl: './recordatorios-dialog.component.html',
  styleUrl: './recordatorios-dialog.component.css',
})
export class RecordatoriosDialogComponent {
  recordatorioForm: FormGroup;
  minDate: Date;
  usuario: any = null;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<RecordatoriosDialogComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: string;
      caso: ICaso;
      recordatorio: IRecordatorio;
    }
  ) {
    this.usuario = this.authService.getUser();
    this.minDate = new Date(new Date().getTime() + 60 * 60 * 1000);
    this.recordatorioForm = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      fecha_hora_limite: new FormControl('', [
        Validators.required,
        this.minDateValidator.bind(this),
      ]),
    });
  }

  ngOnInit(): void {
    if (this.data.action === 'put') {
      const fechaOriginal = new Date(this.data.recordatorio.fecha_hora_limite);

      const fechaLocal = new Date(
        fechaOriginal.getTime() - fechaOriginal.getTimezoneOffset() * 60000
      );
      const fechaFormatoInput = fechaLocal.toISOString().slice(0, 16);

      this.recordatorioForm.patchValue({
        descripcion: this.data.recordatorio.descripcion,
        fecha_hora_limite: fechaFormatoInput,
      });
    }
  }

  onSubmit(): void {
    if (this.recordatorioForm.valid) {
      const recordatorio = {
        ...this.recordatorioForm.value,
        id_caso: this.data.caso.id,
        id_abogado: this.usuario.id,
      };
      if (this.data.action === 'post') {
        this.httpClient
          .post<{ message: string; data: IRecordatorio }>(
            `${environment.casosUrl}/recordatorios`,
            recordatorio
          )
          .subscribe({
            next: (response) => {
              this.snackBarService.showSuccess(response.message);
              this.dialogRef.close(response.data);
            },
            error: (err) => {
              this.snackBarService.showError(
                err.error.isUserFriendly
                  ? err.error.message
                  : 'Error al crear recordatorio'
              );
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
            error: (err) => {
              this.snackBarService.showError(
                err.error.isUserFriendly
                  ? err.error.message
                  : 'Error al editar recordatorio'
              );
            },
          });
      }
    }
  }

  private minDateValidator(
    control: FormControl
  ): { [key: string]: any } | null {
    const selectedDate = new Date(control.value).getTime();
    return selectedDate >= this.minDate.getTime() ? null : { minDate: true };
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}

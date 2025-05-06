import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../core/services/snackbar.service.js';
import { IJUS } from '../../core/interfaces/IJUS.interface.js';
import { environment } from '../../../environments/environment.js';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-jus-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './jus-dialog.component.html',
  styleUrl: './jus-dialog.component.css',
})
export class JusDialogComponent implements OnInit {
  ultimoPrecioJUS: IJUS | null = null;
  historicoJUS: IJUS[] = [];
  formJUS: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<JusDialogComponent>,
    private httpClient: HttpClient,
    private snackBarService: SnackbarService
  ) {
    this.formJUS = new FormGroup({
      valor: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
  }

  ngOnInit(): void {
    this.obtenerUltimoPrecioJUS();
  }

  obtenerUltimoPrecioJUS(): void {
    this.httpClient
      .get<{ message: string; data: IJUS }>(`${environment.jusUrl}/latest`)
      .subscribe({
        next: (response) => {
          this.ultimoPrecioJUS = response.data;
        },
        error: (err) => {
          this.snackBarService.showError(
            err.error.isUserFriendly
              ? err.error.message
              : 'Error al obtener el último precio del JUS'
          );
        },
      });
  }

  obtenerHistoricoJUS(): void {
    //FALTA VER SI SE NECESITA EL HISTORICO O NO, REALICE LA FUNCION POR LAS DUDAS
    this.httpClient
      .get<{ message: string; data: IJUS[] }>(environment.jusUrl)
      .subscribe({
        next: (response) => {
          this.historicoJUS = response.data;
        },
        error: (err) => {
          this.snackBarService.showError(
            err.error.isUserFriendly
              ? err.error.message
              : 'Error al obtener el histórico del JUS'
          );
        },
      });
  }

  onSubmit(): void {
    if (this.formJUS.invalid) {
      this.snackBarService.showError(
        'Por favor, complete correctamente el formulario.'
      );
      return;
    }
    const formData = { ...this.formJUS.value };
    this.httpClient
      .post<{ message: string; data: IJUS }>(environment.jusUrl, formData)
      .subscribe({
        next: (response) => {
          if (!response) {
            throw new Error();
          }
          this.snackBarService.showSuccess(response.message);
          this.dialogRef.close('ok');
        },
        error: (err) => {
          this.snackBarService.showError(
            err.error.isUserFriendly
              ? err.error.message
              : 'Error al actualizar el JUS'
          );
        },
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

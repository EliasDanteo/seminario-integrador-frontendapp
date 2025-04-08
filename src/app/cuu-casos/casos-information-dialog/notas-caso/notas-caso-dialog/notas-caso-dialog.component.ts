import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { INota } from '../../../../core/interfaces/INota.interface.js';
import { SnackbarService } from '../../../../services/snackbar.service.js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.js';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ICaso } from '../../../../core/interfaces/ICaso.interface.js';

@Component({
  selector: 'app-notas-caso-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './notas-caso-dialog.component.html',
  styleUrl: './notas-caso-dialog.component.css',
})
export class NotasCasoDialogComponent implements OnInit {
  notaForm!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<NotasCasoDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { nota: INota | null; action: string; caso: ICaso | null },
    private httpClient: HttpClient,
    private snackBarService: SnackbarService
  ) {
    this.notaForm = new FormGroup({
      titulo: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.data.action === 'put') {
      this.isEdit = true;
      this.notaForm.patchValue({
        titulo: this.data.nota?.titulo,
        descripcion: this.data.nota?.descripcion,
      });
    }
  }

  onSubmit() {
    if (!this.notaForm.valid) {
      this.snackBarService.showError('Complete todos los datos');
      return;
    }
    if (this.isEdit) {
      this.editNota();
    } else {
      this.crearNota();
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  editNota() {
    const formData = {
      ...this.notaForm.value,
      id_abogado: (() => {
        const abogadoData = localStorage.getItem('abogado'); //FALTA ABOGADO CUANDO SE LOGUEA
        if (!abogadoData) {
          throw new Error('Abogado no existente en sesión');
        }
        const parsedAbogado = JSON.parse(abogadoData);
        return parsedAbogado.id;
      })(),
    };
    this.httpClient
      .put<{ message: string; data: INota }>(
        `${environment.casosUrl}/notas/${this.data.nota?.id}`,
        formData
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBarService.showError('Error al actualizar la nota');
        },
      });
  }

  crearNota() {
    if (!this.data.caso) {
      this.snackBarService.showError('No se ha seleccionado un caso');
      return;
    }
    const formData = {
      ...this.notaForm.value,
      id_abogado: (() => {
        const abogadoData = localStorage.getItem('abogado'); //FALTA ABOGADO CUANDO SE LOGUEA
        if (!abogadoData) {
          throw new Error('Abogado no existente en sesión');
        }
        const parsedAbogado = JSON.parse(abogadoData);
        return parsedAbogado.id;
      })(),
      id_caso: this.data.caso?.id,
    };
    this.httpClient
      .post<{ message: string; data: INota }>(
        `${environment.casosUrl}/notas`,
        formData
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBarService.showError('Error al crear la nota');
        },
      });
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../core/services/snackbar.service.js';
import { environment } from '../../../../environments/environment.js';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-noticia-crud-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],

  templateUrl: './noticia-crud-dialog.component.html',
  styleUrl: './noticia-crud-dialog.component.css',
})
export class NoticiaCrudDialogComponent implements OnInit {
  newsForm: FormGroup;
  isEdit: boolean = false;
  entityType: 'noticia';
  todayDate: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: string;
      entityType: 'noticia';
      entity: any;
    },
    public dialogRef: MatDialogRef<NoticiaCrudDialogComponent>,
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {
    this.todayDate = new Date();
    this.entityType = data.entityType;
    this.newsForm = new FormGroup({
      titulo: new FormControl('', [
        Validators.required,
        Validators.maxLength(75),
      ]),
      cuerpo: new FormControl('', [Validators.required]),
      fecha_publicacion: new FormControl(null),
      fecha_vencimiento: new FormControl(null),
    });
  }

  ngOnInit(): void {
    if (this.data.action === 'put') {
      this.isEdit = true;
      this.newsForm.patchValue({
        titulo: this.data.entity.titulo,
        cuerpo: this.data.entity.cuerpo,
        fecha_publicacion: this.formatDateToFrontend(
          this.data.entity.fecha_publicacion
        ),
        fecha_vencimiento: this.formatDateToFrontend(
          this.data.entity.fecha_vencimiento
        ),
      });
    }
  }

  onSubmit(): void {
    try {
      if (this.newsForm.valid) {
        const formData = {
          ...this.newsForm.value,
          fecha_publicacion: this.newsForm.value.fecha_publicacion
            ? this.formatDateToBackend(this.newsForm.value.fecha_publicacion)
            : null,
          fecha_vencimiento: this.newsForm.value.fecha_vencimiento
            ? this.formatDateToBackend(this.newsForm.value.fecha_vencimiento)
            : null,
        };

        if (formData.fecha_publicacion === null) {
          formData.fecha_publicacion = undefined;
        }
        if (formData.fecha_vencimiento === null) {
          formData.fecha_vencimiento = undefined;
        }

        if (!formData.fecha_publicacion && formData.fecha_vencimiento) {
          throw new Error('La fecha de publicación es requerida');
        }
        if (formData.fecha_publicacion && !formData.fecha_vencimiento) {
          throw new Error('La fecha de vencimiento es requerida');
        }

        if (formData.fecha_publicacion && formData.fecha_vencimiento) {
          if (formData.fecha_publicacion >= formData.fecha_vencimiento) {
            this.newsForm.get('fecha_publicacion')?.reset();
            this.newsForm.get('fecha_vencimiento')?.reset();
            throw new Error(
              'La fecha de publicación no puede ser mayor a la fecha de vencimiento'
            );
          }
        }
        if (this.isEdit) {
          this.http
            .put(`${environment.noticiasUrl}/${this.data.entity.id}`, formData)
            .subscribe({
              next: (response) => {
                this.snackbarService.showSuccess(
                  'Noticia actualizada correctamente',
                  5000
                );
                this.dialogRef.close(true);
              },
              error: (err) => {
                this.snackbarService.showError(
                  'Error al actualizar la noticia',
                  5000
                );
                console.error('Error al actualizar la noticia', err);
              },
            });
        } else if (!this.isEdit) {
          this.http.post(`${environment.noticiasUrl}`, formData).subscribe({
            next: (response) => {
              this.snackbarService.showSuccess(
                'Noticia creada correctamente',
                5000
              );
              this.dialogRef.close(true);
            },
            error: (err) => {
              this.snackbarService.showError('Error al crear la noticia', 5000);
              console.error('Error al crear la noticia', err);
            },
          });
        }
      }
    } catch (error: any) {
      this.snackbarService.showError(error.message, 5000);
    }
  }

  onClose(): void {
    this.dialogRef.close('none');
  }

  getMinVencimientoDate(): Date {
    const fechaPublicacion = this.newsForm.get('fecha_publicacion')?.value;

    if (fechaPublicacion) {
      const minDate = new Date(fechaPublicacion);
      minDate.setDate(minDate.getDate() + 1);
      return minDate;
    } else {
      const minDate = new Date(this.todayDate);
      minDate.setDate(minDate.getDate() + 1);
      return minDate;
    }
  }

  formatDateToFrontend(dateString: string): Date {
    const parts = dateString.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  formatDateToBackend(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

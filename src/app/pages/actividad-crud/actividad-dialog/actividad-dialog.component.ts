import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../core/services/snackbar.service.js';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../environments/environment.js';
import { catchError, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-actividad-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
  ],
  templateUrl: './actividad-dialog.component.html',
  styleUrl: './actividad-dialog.component.css',
})
export class ActividadDialogComponent {
  entityForm: FormGroup;
  entityType = 'actividad';
  isEdit: boolean = false;
  currentDateTime: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: string;
      entityType: 'actividad';
      entity: any;
      type?: 'name' | 'price';
      actividades?: any[];
    },
    public dialogRef: MatDialogRef<ActividadDialogComponent>,
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {
    this.entityType = data.entityType;
    this.entityForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      cant_jus: new FormControl(null, [
        Validators.required,
        Validators.min(0.001),
      ]),
    });
  }

  ngOnInit(): void {
    if (this.data.action === 'put' && this.data.entity) {
      if (this.data.type === 'name') {
        this.entityForm.patchValue({
          nombre: '',
          cant_jus: this.data.entity.cant_jus ?? 0,
        });
      } else if (this.data.type === 'price') {
        this.entityForm.patchValue({
          nombre: this.data.entity.nombre,
          cant_jus: 0,
        });
      }

      this.isEdit = true;
    }

    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  onSubmit(): void {
    if (this.entityForm.valid) {
      const nuevoNombre = this.normalizeText(
        this.entityForm.value.nombre ?? ''
      ).trim();

      const nombreExistente = this.data.actividades?.some(
        (actividad) => this.normalizeText(actividad.nombre) === nuevoNombre
      );

      if (
        (this.data.action === 'post' || this.data.type === 'name') &&
        nombreExistente
      ) {
        this.snackbarService.showError('Ese nombre ya existe.');
        return;
      }

      if (
        this.data.action === 'put' &&
        this.data.type === 'price' &&
        Number(this.entityForm.value.cant_jus) ===
          Number(this.data.entity.cant_jus)
      ) {
        this.snackbarService.showError(
          'El nuevo precio debe ser distinto al actual.',
          5000
        );
        return;
      }

      const formData = {
        ...this.entityForm.value,
        nombre: (this.entityForm.value.nombre ?? '').trim(),
        cant_jus: parseFloat(this.entityForm.value.cant_jus),
      };

      if (this.data.action === 'post') {
        this.http
          .post<any>(environment.actividadesUrl, formData)
          .pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe({
            next: (response) => {
              this.snackbarService.showSuccess('¡Creación exitosa!', 5000);
              this.dialogRef.close(response);
            },
          });
      } else if (this.data.action === 'put' && this.data.entity?.id) {
        this.http
          .put<any>(
            environment.actividadesUrl + '/' + this.data.entity.id,
            formData
          )
          .pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe({
            next: (response) => {
              this.snackbarService.showSuccess('¡Actualización exitosa!', 5000);
              this.dialogRef.close(response);
            },
          });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close('none');
  }

  updateDateTime(): void {
    this.currentDateTime = new Date().toLocaleString();
  }
}

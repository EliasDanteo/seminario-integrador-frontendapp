import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../services/snackbar.service.js';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../environments/environment.js';
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
  actividadesExistentes: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: string;
      entityType: 'actividad';
      entity: any;
      type?: 'name' | 'price';
      actividades?: any[]; //para luego validar si los nombres act se repiten
    },
    public dialogRef: MatDialogRef<ActividadDialogComponent>,
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {
    console.log('Datos recibidos: ', this.data);

    this.entityType = data.entityType;
    this.entityForm = new FormGroup({
      nombre_actual: new FormControl({ value: '', disabled: true }),
      nombre: new FormControl(null, [Validators.required]),
      cant_jus_actual: new FormControl({ value: '', disabled: true }),
      cant_jus: new FormControl(null, [
        Validators.required,
        Validators.min(0.01),
      ]),
    });
  }

  ngOnInit(): void {
    console.log('Datos recibidos para editar:', this.data.entity);

    if (this.data.action === 'put' && this.data.entity) {
      if (this.data.type === 'name') {
        this.entityForm.patchValue({
          nombre_actual: this.data.entity.nombre,
          nombre: '',
          cant_jus: this.data.entity.cant_jus ?? 0,
        });
      } else if (this.data.type === 'price') {
        this.entityForm.patchValue({
          nombre: this.data.entity.nombre,
          cant_jus_actual: this.data.entity.cant_jus,
          cant_jus: 0,
        });
      }

      console.log('Formulario inicializado con:', this.entityForm.value);
      this.isEdit = true;
    }

    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  onSubmit(): void {
    if (this.entityForm.valid) {
      const formData = {
        ...this.entityForm.value,
      };

      console.log('Acción:', this.data.action);
      console.log('ID de la entidad:', this.data.entity?.id);
      console.log('Datos enviados:', formData);

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
    this.snackbarService.showError('Cancelando', 5000);
    this.dialogRef.close('none');
  }

  updateDateTime(): void {
    this.currentDateTime = new Date().toLocaleString();
  }
}

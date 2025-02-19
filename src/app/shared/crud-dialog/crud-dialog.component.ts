import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { environment } from '../../../environments/environment.js';
import { catchError, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import IAbogado from '../../core/interfaces/IAbogado.interface.js';
import { ICliente } from '../../core/interfaces/ICliente.interface.js';

@Component({
  selector: 'app-crud-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
  ],
  templateUrl: './crud-dialog.component.html',
  styleUrl: './crud-dialog.component.css',
})
export class CRUDDialogComponent implements OnInit {
  entityForm: FormGroup;
  isEdit: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  entityType: 'abogado' | 'cliente' | 'empresa';
  es_empresa: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: string;
      entityType: 'abogado' | 'cliente' | 'empresa';
      entity: any;
    },
    private dialogRef: MatDialogRef<CRUDDialogComponent>,
    private http: HttpClient
  ) {
    this.entityType = data.entityType;
    this.entityForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', Validators.required),
      tipo_doc: new FormControl('', Validators.required),
      nro_doc: new FormControl('', Validators.required),
      contrasena: new FormControl('', Validators.required),
      foto: new FormControl(null),
      es_empresa: new FormControl(false),
    });
    if (this.entityType === 'cliente') {
      this.entityForm.addControl('es_empresa', new FormControl(false));
    }

    if (this.entityType === 'empresa') {
      this.entityForm.addControl('es_empresa', new FormControl(true));
      this.entityForm.removeControl('apellido');
    }

    if (this.entityType === 'abogado') {
      this.entityForm.addControl(
        'matricula',
        new FormControl('', Validators.required)
      );
      this.entityForm.addControl(
        'rol',
        new FormControl(null, [Validators.required, Validators.min(1)])
      );
    }
  }

  ngOnInit(): void {
    if (this.data.action === 'put') {
      this.isEdit = true;
      this.entityForm.patchValue(this.data.entity);

      if (this.entityType === 'abogado' && this.data.entity.rol) {
        this.entityForm.patchValue({ rol: this.data.entity.rol.id });
      }

      if (this.data.entity.foto) {
        if (this.data.entity.foto instanceof Blob) {
          this.previewUrl = URL.createObjectURL(this.data.entity.foto);
        } else if (
          this.data.entity.foto.type === 'Buffer' &&
          Array.isArray(this.data.entity.foto.data)
        ) {
          const blob = new Blob([new Uint8Array(this.data.entity.foto.data)], {
            type: 'image/jpeg',
          });
          this.previewUrl = URL.createObjectURL(blob);
          this.entityForm.patchValue({ foto: blob });
        }
      }
      this.entityForm.get('contrasena')?.clearValidators();
      this.entityForm.get('contrasena')?.updateValueAndValidity();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.entityForm.patchValue({ foto: this.selectedFile });
      this.entityForm.get('foto')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.entityForm.valid) {
      const formData = { ...this.entityForm.value };
      if (!formData.contrasena) {
        delete formData.contrasena;
      }
      if (!this.selectedFile) {
        delete formData.foto;
      }
      const apiUrl =
        this.entityType === 'abogado'
          ? environment.abogadosUrl
          : environment.clientesUrl;

      if (this.data.action === 'post') {
        this.http
          .post<any>(apiUrl, formData)
          .pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe({
            next: (response) => {
              this.dialogRef.close(response);
            },
          });
      } else if (this.data.action === 'put' && this.data.entity?.id) {
        this.http
          .put<any>(`${apiUrl}/${this.data.entity.id}`, formData)
          .pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe({
            next: (response) => {
              this.dialogRef.close(response);
            },
          });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close('none');
  }
}

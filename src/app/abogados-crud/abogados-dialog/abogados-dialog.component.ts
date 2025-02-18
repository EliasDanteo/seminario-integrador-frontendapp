import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OnInit } from '@angular/core';
import IAbogado from '../../core/interfaces/IAbogado.interface.js';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.js';
import { catchError, of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';

import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'app-abogados-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './abogados-dialog.component.html',
  styleUrl: './abogados-dialog.component.css',
})
export class AbogadosDialogComponent implements OnInit {
  abogadoForm: FormGroup;
  isEdit: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { action: string; abogado: IAbogado },
    private dialogRef: MatDialogRef<AbogadosDialogComponent>,
    private http: HttpClient
  ) {
    this.abogadoForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', Validators.required),
      tipo_doc: new FormControl('', Validators.required),
      nro_doc: new FormControl('', Validators.required),
      matricula: new FormControl('', Validators.required),
      rol: new FormControl(null, [Validators.required, Validators.min(1)]),
      contrasena: new FormControl('', Validators.required),
      foto: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.data.action === 'put') {
      this.isEdit = true;
      this.abogadoForm.patchValue(this.data.abogado);

      if (this.data.abogado.rol) {
        this.abogadoForm.patchValue({
          rol: this.data.abogado.rol.id,
        });
      }

      //TODO: ARREGLAR LA CARGA DE FOTO EN EDICION

      if (this.data.abogado.foto) {
        if (this.data.abogado.foto instanceof Blob) {
          this.previewUrl = URL.createObjectURL(this.data.abogado.foto);
        } else if (
          this.data.abogado.foto.type === 'Buffer' &&
          Array.isArray(this.data.abogado.foto.data)
        ) {
          const blob = new Blob([new Uint8Array(this.data.abogado.foto.data)], {
            type: 'image/jpeg',
          });
          this.previewUrl = URL.createObjectURL(blob);
          this.abogadoForm.patchValue({
            foto: blob,
          });
        }
      }
      this.abogadoForm.get('contrasena')?.clearValidators();
      this.abogadoForm.get('contrasena')?.updateValueAndValidity();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.abogadoForm.patchValue({
        foto: this.selectedFile,
      });
      this.abogadoForm.get('foto')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.abogadoForm.valid) {
      const formData = {
        ...this.abogadoForm.value,
        id_rol: Number(this.abogadoForm.value.rol),
      };
      if (!formData.contrasena) {
        delete formData.contrasena;
      }
      if (!this.selectedFile) {
        delete formData.foto;
      }
      if (this.data.action === 'post') {
        this.http
          .post<any>(environment.abogadosUrl, formData)
          .pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe({
            next: (response) => {
              console.log('Abogado creado:', response);
              this.dialogRef.close(response);
            },
          });
      } else if (this.data.action === 'put' && this.data.abogado?.id) {
        this.http
          .put<any>(
            `${environment.abogadosUrl}/${this.data.abogado.id}`,
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
              console.log('Abogado actualizado:', response);
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

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
      fecha_alta: new FormControl(new Date(), Validators.required),
      fecha_baja: new FormControl(''),
      rol: new FormControl(null, [Validators.required, Validators.min(1)]),
      contrasena: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.data.action === 'put') {
      this.isEdit = true;

      this.abogadoForm.patchValue(this.data.abogado);
    }
  }

  onSubmit(): void {
    if (this.abogadoForm.valid) {
      const formData = {
        ...this.abogadoForm.value,
        fecha_alta: this.formatDate(this.abogadoForm.value.fecha_alta),
        id_rol: Number(this.abogadoForm.value.rol),
      };

      if (this.data.action === 'post') {
        this.http
          .post<any>(environment.abogadosUrl, formData)
          .pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe();
      }
      console.log('Datos enviados:', formData);
      this.dialogRef.close(formData);
    }
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onClose(): void {
    this.dialogRef.close('none');
  }
}

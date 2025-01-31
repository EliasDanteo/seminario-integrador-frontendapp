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
  ],
  templateUrl: './abogados-dialog.component.html',
  styleUrl: './abogados-dialog.component.css',
})
export class AbogadosDialogComponent implements OnInit {
  abogadoForm: FormGroup;
  isEdit: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { action: string; abogado: IAbogado },
    private dialogRef: MatDialogRef<AbogadosDialogComponent>
  ) {
    this.abogadoForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', Validators.required),
      tipo_doc: new FormControl('', Validators.required),
      nro_doc: new FormControl('', Validators.required),
      matricula: new FormControl('', Validators.required),
      fecha_alta: new FormControl('', Validators.required),
      fecha_baja: new FormControl(''),
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
      this.dialogRef.close(this.abogadoForm.value);
    }
  }

  onClose(): void {
    this.dialogRef.close('none');
  }
}

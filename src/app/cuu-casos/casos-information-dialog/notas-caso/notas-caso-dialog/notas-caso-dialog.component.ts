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

  constructor(
    private dialogRef: MatDialogRef<NotasCasoDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { nota: INota | null; action: string },
    private httpClient: HttpClient,
    private snackBarService: SnackbarService
  ) {
    this.notaForm = new FormGroup({
      titulo: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  onGuardar() {
    if (this.notaForm.valid) {
      this.dialogRef.close(this.notaForm.value);
    }
  }
}

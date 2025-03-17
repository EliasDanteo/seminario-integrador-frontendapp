import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service.js';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import IAbogado from '../../core/interfaces/IAbogado.interface.js';
import { environment } from '../../../environments/environment.js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IFeedback } from '../../core/interfaces/IFeedback.interface.js';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-feedback-dialog',
  standalone: true,
  imports: [
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './feedback-dialog.component.html',
  styleUrl: './feedback-dialog.component.css',
})
export class FeedbackDialogComponent implements OnInit {
  currentDate = new Date();
  abogados_a_calificar: IAbogado[] = [];
  feedbackForm: FormGroup;
  selectedMatricula: string = '';
  selectedFoto: SafeUrl | null = null;
  selectedAbogado: IAbogado | null = null;
  constructor(
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_caso: number },
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    private sanitizer: DomSanitizer
  ) {
    this.feedbackForm = new FormGroup({
      puntuacion: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(10),
      ]),
      descripcion: new FormControl('', Validators.required),
      id_abogado: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadAbogados();
    this.setupMatricula();
  }

  ngOnDestroy() {
    if (this.selectedFoto) {
      URL.revokeObjectURL(this.selectedFoto.toString());
    }
  }

  loadAbogados(): void {
    if (!this.data) {
      return;
    }
    this.httpClient
      .get<{ message: string; data: IAbogado[] }>(
        `${environment.feedbackUrl}/abogados-calificables/${this.data.id_caso}`
      )
      .subscribe({
        next: (response) => {
          if (!response) {
            this.snackBarService.showError(
              'No se encontraron abogados para calificar'
            );
            return;
          }
          this.abogados_a_calificar = response.data.map((abogado) => ({
            ...abogado,
            id: abogado.id_abogado,
          }));
          console.log(this.abogados_a_calificar);
        },
        error: (error) => {
          this.snackBarService.showError(error.error.message);
        },
      });
  }

  private setupMatricula(): void {
    this.feedbackForm.get('id_abogado')?.valueChanges.subscribe((idAbogado) => {
      this.selectedAbogado =
        this.abogados_a_calificar.find(
          (abogado) => abogado.id_abogado === idAbogado
        ) || null;

      if (this.selectedAbogado) {
        this.selectedMatricula = this.selectedAbogado.matricula;
        this.loadFoto(this.selectedAbogado.foto);
      } else {
        this.selectedMatricula = '';
        this.selectedFoto = null;
      }
    });
  }

  private loadFoto(
    fotoData: Blob | { type: string; data: number[] } | undefined
  ): void {
    if (!fotoData) {
      console.warn('No se recibió fotoData.');
      this.selectedFoto = null;
      return;
    }

    let blob: Blob;

    if (fotoData instanceof Blob) {
      blob = fotoData;
    } else {
      if (!fotoData.data || fotoData.data.length === 0) {
        this.selectedFoto = null;
        return;
      }
      const uint8Array = new Uint8Array(fotoData.data);
      blob = new Blob([uint8Array], { type: fotoData.type || 'image/jpeg' });
    }

    if (blob.size <= 0) {
      this.selectedFoto = null;
      return;
    }

    const objectURL = URL.createObjectURL(blob);
    this.selectedFoto = objectURL;
  }

  onSubmit(): void {
    if (this.feedbackForm.invalid) {
      this.snackBarService.showError(
        'Formulario inválido, complete bien los datos'
      );
      return;
    }
    const formData = {
      ...this.feedbackForm.value,
      id_caso: this.data.id_caso,
    };
    this.httpClient
      .post<{ message: string; data: IFeedback }>(
        `${environment.feedbackUrl}`,
        formData
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.dialogRef.close();
        },
        error: (error) => {
          this.snackBarService.showError(error.error.message);
        },
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

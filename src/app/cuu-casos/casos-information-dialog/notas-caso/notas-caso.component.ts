import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { SnackbarService } from '../../../services/snackbar.service.js';
import { INota } from '../../../core/interfaces/INota.interface.js';
import { ICaso } from '../../../core/interfaces/ICaso.interface.js';
import { environment } from '../../../../environments/environment.js';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-notas-caso',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './notas-caso.component.html',
  styleUrl: './notas-caso.component.css',
})
export class NotasCasoComponent implements OnInit {
  notasCaso: INota[] = [];
  formNota: FormGroup;

  @Input() caso!: ICaso;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService
  ) {
    this.formNota = new FormGroup({
      titulo: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadNotasCaso();
  }

  loadNotasCaso() {
    this.httpClient
      .get<{ message: string; data: INota[] }>(
        `${environment.casosUrl}/notas/${this.caso.id}`
      )
      .subscribe({
        next: (response) => {
          this.notasCaso = response.data;
          console.log(this.notasCaso);
        },
        error: (error) => {
          this.snackBarService.showError('Error al cargar las notas del caso');
        },
      });
  }

  addNota() {
    if (this.formNota.invalid) {
      this.snackBarService.showError('Formulario inválido');
      return;
    }

    const newNota: INota = {
      ...this.formNota.value,
      // id_abogado: this.caso.abogado.id, FALTA OBTENER EL ID DE LA SESION
      id_caso: this.caso.id,
    };

    this.httpClient
      .post<{ message: string }>(`${environment.casosUrl}/notas/`, newNota)
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.loadNotasCaso();
          this.formNota.reset();
        },
        error: () => {
          this.snackBarService.showError('Error al agregar la nota');
        },
      });
  }

  editNota(nota: INota) {
    if (this.formNota.invalid) {
      this.snackBarService.showError('Formulario inválido');
      return;
    }

    this.httpClient
      .put<{ message: string }>(
        `${environment.casosUrl}/notas/${this.caso.id}/${nota.abogado.id}/${nota.fecha_hora}`,
        this.formNota.value
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.loadNotasCaso();
        },
        error: () => {
          this.snackBarService.showError('Error al editar la nota');
        },
      });
  }

  deleteNota(nota: INota) {
    this.httpClient
      .delete<{ message: string }>(
        `${environment.casosUrl}/notas/${this.caso.id}/${nota.abogado.id}/${nota.fecha_hora}`
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.loadNotasCaso();
        },
        error: () => {
          this.snackBarService.showError('Error al eliminar la nota');
        },
      });
  }
}

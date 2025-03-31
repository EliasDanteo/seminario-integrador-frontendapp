import { Component, Input, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { ICaso } from '../../../core/interfaces/ICaso.interface.js';
import IAbogado from '../../../core/interfaces/IAbogado.interface.js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.js';
import { CommonModule } from '@angular/common';
import { IAbogadoCaso } from '../../../core/interfaces/IAbogadoCaso.interface.js';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '../../../services/snackbar.service.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-abogados-caso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatOptionModule,
    MatListModule,
    MatCardModule,
  ],
  templateUrl: './abogados-caso.component.html',
  styleUrl: './abogados-caso.component.css',
})
export class AbogadosCasoComponent implements OnInit {
  @Input() caso!: ICaso;
  abogadosCasos: IAbogadoCaso[] = [];
  posiblesAbogados: IAbogado[] = [];
  formAbogadoCaso: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService
  ) {
    this.formAbogadoCaso = new FormGroup({
      id_abogado: new FormControl('', Validators.required),
      detalle: new FormControl(''),
      abogadoActivo: new FormControl(''),
    });
  }

  ngOnInit() {
    this.loadAbogados();
  }

  loadAbogados() {
    this.loadPosiblesAbogados();
    this.loadAbogadosCaso();
  }

  loadAbogadosCaso() {
    if (this.caso) {
      this.httpClient
        .get<{ message: String; data: IAbogadoCaso[] }>(
          `${environment.casosUrl}/abogados-casos/${this.caso.id}`
        )
        .subscribe({
          next: (response) => {
            if (response.data) {
              this.abogadosCasos = response.data;
            } else {
              console.error(
                'No se encontraron abogados para el caso proporcionado.'
              );
            }
          },
        });
    }
  }

  loadPosiblesAbogados() {
    this.httpClient
      .get<{ message: String; data: IAbogado[] }>(
        `${environment.abogadosUrl}/disponibles/caso/${this.caso.id}`
      )
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.posiblesAbogados = response.data;
          } else {
            console.error(
              'No se encontraron abogados para el caso proporcionado.'
            );
          }
        },
      });
  }

  desvincularAbogado() {
    if (!this.caso) return;

    const idAbogadoCaso = Number(
      this.formAbogadoCaso.get('abogadoActivo')?.value
    );
    if (!idAbogadoCaso) {
      this.snackBarService.showError(
        'Por favor, selecciona un abogado activo para desvincular'
      );
      return;
    }

    this.httpClient
      .patch(
        `${environment.casosUrl}/abogados-casos/${idAbogadoCaso}/desvincular/`,
        {}
      )
      .subscribe({
        next: () => {
          this.snackBarService.showSuccess(
            'Abogado desvinculado correctamente'
          );
          this.loadAbogados();
          this.formAbogadoCaso.reset();
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBarService.showError(
            error.error?.message || 'Error al desvincular'
          );
        },
      });
  }

  vincularAbogado() {
    if (this.formAbogadoCaso.valid) {
      const data = {
        id_abogado: Number(this.formAbogadoCaso.get('id_abogado')?.value),
        id_caso: Number(this.caso.id),
        detalle: this.formAbogadoCaso.get('detalle')?.value,
      };

      this.httpClient
        .post(`${environment.casosUrl}/abogados-casos/`, data)
        .subscribe({
          next: () => {
            this.snackBarService.showSuccess('Abogado vinculado correctamente');
            this.loadAbogados();
            this.formAbogadoCaso.reset();
          },
          error: (error) => {
            console.error('Error completo:', error);
            this.snackBarService.showError(
              error.error?.message || 'Error al vincular abogado'
            );
          },
        });
    } else {
      this.snackBarService.showError('Complete todos los campos requeridos');
    }
  }
}

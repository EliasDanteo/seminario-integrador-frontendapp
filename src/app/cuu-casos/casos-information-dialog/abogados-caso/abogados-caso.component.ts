import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-abogados-caso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './abogados-caso.component.html',
  styleUrl: './abogados-caso.component.css',
})
export class AbogadosCasoComponent implements OnInit {
  @Input() caso!: ICaso;
  currentAbogados: IAbogado[] = [];
  posiblesAbogados: IAbogado[] = [];
  formAbogadoCaso: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService
  ) {
    this.formAbogadoCaso = new FormGroup({
      id_abogado: new FormControl('', Validators.required),
      detalle: new FormControl(''),
    });
  }

  ngOnInit() {
    this.loadAbogadosCaso();
    this.loadPosiblesAbogados();
  }

  loadAbogadosCaso() {
    if (this.caso) {
      this.httpClient
        .get<{ message: String; data: IAbogadoCaso[] }>(
          `${environment.casosUrl}/abogados-casos/${this.caso.id}`
        )
        .subscribe({
          next: (response) => {
            console.log(response);
            if (response.data) {
              this.currentAbogados = response.data.map(
                (abogadoCaso) => abogadoCaso.abogado
              );
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
      .get<{ message: String; data: IAbogado[] }>(environment.abogadosUrl)
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

  desvincularAbogado(abogadoCasoId: number) {}

  vincularAbogado() {
    if (this.formAbogadoCaso.valid) {
      const formData = {
        ...this.formAbogadoCaso.value,
        id_caso: this.caso.id,
      };
      this.httpClient
        .post(`${environment.casosUrl}/abogados-casos/`, {
          formData,
        })
        .subscribe({
          next: () => {
            this.snackBarService.showSuccess(
              'Abogado vinculado correctamente al caso'
            );
            this.loadAbogadosCaso();
            this.formAbogadoCaso.reset();
          },
          error: (error) => console.error('Error al vincular:', error),
        });
    } else {
      this.snackBarService.showError(
        'Por favor, completa todos los campos requeridos'
      );
    }
  }
}

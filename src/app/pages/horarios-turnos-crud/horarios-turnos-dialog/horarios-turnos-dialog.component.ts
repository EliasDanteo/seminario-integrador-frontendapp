import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
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
import { SnackbarService } from '../../../core/services/snackbar.service.js';
import {
  HorarioTurnoService,
  IHorarioTurnoCreate,
} from '../../../core/services/horarioTurno.service.js';
import { catchError, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { IAbogado } from '../../../core/interfaces/IAbogado.interface.js';
import { AbogadoService } from '../../../core/services/abogados.service.js';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-horarios-turnos-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './horarios-turnos-dialog.component.html',
  styleUrl: './horarios-turnos-dialog.component.css',
})
export class HorariosTurnosDialogComponent {
  entityForm: FormGroup;
  isEdit: boolean = false;
  abogados: IAbogado[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: string;
      entityType: 'horarioTurno';
      entity: any;
      horarios?: any[];
    },
    public dialogRef: MatDialogRef<HorariosTurnosDialogComponent>,
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private horarioTurnoService: HorarioTurnoService,
    private abogadosService: AbogadoService
  ) {
    this.entityForm = new FormGroup({
      abogado: new FormControl(null, [Validators.required]), // seleccionar un abogado (id) por el momento
      dia_semana: new FormControl(null, [Validators.required]),
      hora_inicio: new FormControl(null, [Validators.required]),
      hora_fin: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getAbogados();

    if (this.data.action === 'put' && this.data.entity) {
      this.entityForm.patchValue(this.data.entity);
      this.isEdit = true;
    }
  }

  onSubmit(): void {
    if (this.entityForm.valid) {
      const formValue = this.entityForm.value;

      const datosFormulario: IHorarioTurnoCreate = {
        hora_inicio: formValue.hora_inicio,
        hora_fin: formValue.hora_fin,
        dia_semana: formValue.dia_semana,
        abogado: { id: formValue.abogado }, // el select solo devuelve el id
      };

      if (this.data.action === 'post') {
        this.horarioTurnoService
          .create(datosFormulario)
          .pipe(
            catchError((error) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe({
            next: (res) => {
              this.snackbarService.showSuccess('¡Creación exitosa!', 5000);
              this.dialogRef.close(res);
            },
          });
      }
    } else if (this.data.action === 'put' && this.data.entity?.id) {
      this.horarioTurnoService
        .update(this.data.entity.id.toString())
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

  onClose(): void {
    this.dialogRef.close('none');
  }

  //por el momento
  getAbogados() {
    this.abogadosService.getAll().subscribe({
      next: (response) => {
        this.abogados = response.data;
      },
      error: (err) => {
        console.error('Error al cargar los abogados', err);
        alert('Hubo un error al cargar los abogados. Inténtalo nuevamente.');
      },
    });
  }
}

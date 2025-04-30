import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { IActividadRealizada } from '../../../core/interfaces/IActividad-realizada.interface.js';
import { ActividadesAbogadoService } from '../../../core/services/actividades-abogado.service.js';
import { SnackbarService } from '../../../core/services/snackbar.service.js';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service.js';
import { ActividadesService } from '../../../core/services/actividades.service.js';
import { IActividad } from '../../../core/interfaces/IActividad.interface.js';
import { ICliente } from '../../../core/interfaces/ICliente.interface.js';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { JusService } from '../../../core/services/jus.service.js';
import { AuthService } from '../../../core/services/auth.service.js';
import { TipoUsuarioEnum } from '../../../core/utils/enums.js';

@Component({
  selector: 'app-mis-actividades-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './mis-actividades-dialog.component.html',
  styleUrl: './mis-actividades-dialog.component.css',
})
export class MisActividadesDialogComponent implements OnInit {
  isEdit: boolean = false;
  actividadRealizadaForm: FormGroup | null = null;
  actividades: IActividad[] = [];
  clientes: ICliente[] = [];
  precioJus: number = 0;
  idAbogado: number | null = null;
  user: any = null;
  costoActividad: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { action: string; actividad: IActividadRealizada | null },
    private actividadesAbogadoService: ActividadesAbogadoService,
    private clientesService: ClienteService,
    private actividadesService: ActividadesService,
    private jusService: JusService,
    private snackBarService: SnackbarService,
    private matDialogRef: MatDialogRef<MisActividadesDialogComponent>,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
    if (this.user && this.user.tipo_usuario === TipoUsuarioEnum.ABOGADO) {
      this.idAbogado = this.user.id;
    }
    if (data.action !== 'delete') {
      this.actividadRealizadaForm = new FormGroup({
        id_actividad: new FormControl('', Validators.required),
        id_cliente: new FormControl('', Validators.required),
      });
    }
  }

  async ngOnInit(): Promise<void> {
    await this.loadPrecioJus();
    await this.loadActividades();
    this.loadClientes();

    if (this.data.action === 'update' && this.data.actividad) {
      this.isEdit = true;
      const actividadActual = this.actividades.find(
        (a) => a.id === this.data.actividad?.actividad.id
      );

      this.actividadRealizadaForm?.patchValue({
        id_actividad: this.data.actividad.actividad.id,
        id_cliente: this.data.actividad.cliente.id,
      });

      if (actividadActual) {
        this.costoActividad = actividadActual?.precio_pesos ?? 0;
      }
    }
  }

  private loadPrecioJus(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.jusService.getJusPrice().subscribe({
        next: (response) => {
          this.precioJus = response.data.valor;
          resolve();
        },
        error: (err) => {
          this.snackBarService.showError('Error al cargar el precio de Jus');
          reject(err);
        },
      });
    });
  }

  private loadActividades(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.actividadesService.getAllActividades().subscribe({
        next: (response) => {
          this.actividades = response.data.map((actividad) => ({
            ...actividad,
            precio_pesos: actividad.cant_jus * this.precioJus,
          }));
          resolve();
        },
        error: (err) => {
          this.snackBarService.showError('Error al cargar las actividades');
          reject(err);
        },
      });
    });
  }

  loadClientes() {
    this.clientesService.getAll().subscribe({
      next: (response) => {
        this.clientes = response.data;
      },
      error: () => {
        this.snackBarService.showError('Error al cargar los clientes');
      },
    });
  }

  actualizarCosto() {
    const actividadId = this.actividadRealizadaForm?.get('id_actividad')?.value;
    const actividadSeleccionada = this.actividades.find(
      (a) => a.id === actividadId
    );
    this.costoActividad = actividadSeleccionada?.precio_pesos || 0;
  }

  onSubmit() {
    if (this.data.action !== 'delete') {
      if (this.actividadRealizadaForm?.valid) {
        const actividad = {
          ...this.actividadRealizadaForm.value,
          fecha_hora: new Date().toISOString(),
          id_abogado: this.idAbogado,
        };
        if (this.data.action === 'create') {
          this.createActividad(actividad);
        } else if (this.data.action === 'update') {
          this.updateActividad(actividad, this.data.actividad!.id);
        }
      } else {
        this.snackBarService.showError('Formulario inválido');
      }
    } else {
      this.deleteActividad(this.data.actividad!.id);
    }
  }

  createActividad(actividad: IActividadRealizada) {
    this.actividadesAbogadoService.createActividad(actividad).subscribe({
      next: (response) => {
        this.snackBarService.showSuccess('Actividad creada con éxito');
        this.matDialogRef.close(response.data);
      },
      error: () => {
        this.snackBarService.showError('Error al crear la actividad');
      },
    });
  }

  updateActividad(actividad: IActividadRealizada, id_actividad: number) {
    this.actividadesAbogadoService
      .updateActividad(actividad, id_actividad)
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess('Actividad actualizada con éxito');
          this.matDialogRef.close(response.data);
        },
        error: () => {
          this.snackBarService.showError('Error al actualizar la actividad');
        },
      });
  }

  deleteActividad(id_actividad: number) {
    this.actividadesAbogadoService.deleteActividad(id_actividad).subscribe({
      next: (response) => {
        this.snackBarService.showSuccess(response.message);
        this.matDialogRef.close(response.data);
      },
      error: () => {
        this.snackBarService.showError('Error al eliminar la actividad');
      },
    });
  }

  onClose() {
    this.matDialogRef.close('none');
  }
}

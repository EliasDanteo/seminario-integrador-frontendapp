import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ICaso } from '../../../core/interfaces/ICaso.interface.js';
import { CasosService } from '../../../core/services/casos.service.js';
import { SnackbarService } from '../../../core/services/snackbar.service.js';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service.js';
import { ICliente } from '../../../core/interfaces/ICliente.interface.js';
import { IAbogado } from '../../../core/interfaces/IAbogado.interface.js';
import { AbogadoService } from '../../../core/services/abogados.service.js';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IEspecialidad } from '../../../core/interfaces/IEspecialidad.interface.js';
import { EspecialidadesService } from '../../../core/services/especialidades.service.js';
import { ICasoCreate } from '../../../core/services/casos.service.js';
import { RouterModule } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';
import { CRUDDialogComponent } from '../../../shared/crud-dialog/crud-dialog.component.js';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PlanPagoDialogComponent } from './plan-pago-dialog/plan-pago-dialog.component.js';
import { AuthService } from '../../../core/services/auth.service.js';

@Component({
  selector: 'app-casos-crud-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    MatOptionModule,
    MatStepperModule,
    MatFormFieldModule,
    RouterModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './casos-crud-dialog.component.html',
  styleUrl: './casos-crud-dialog.component.css',
})
export class CasosCrudDialogComponent implements OnInit {
  clientes: ICliente[] = [];
  especialidades: IEspecialidad[] = [];
  abogados: IAbogado[] = [];
  filteredAbogadosEspecialidad: IAbogado[] = [];
  actions = ['delete', 'put', 'post', 'end'];
  abogadoPrincipal: IAbogado | null = null;

  especialidadControl = new FormControl(null);

  clienteForm: FormGroup;
  abogadoForm: FormGroup;
  casosForm: FormGroup;
  isAdmin: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { action: string; caso: ICaso | null },
    private casosService: CasosService,
    private snackBarService: SnackbarService,
    private clienteService: ClienteService,
    private abogadoService: AbogadoService,
    private especialidadesService: EspecialidadesService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CasosCrudDialogComponent>,
    private dialog: MatDialog
  ) {
    this.casosForm = new FormGroup({
      descripcion: new FormControl('', [Validators.required]),
      id_especialidad: new FormControl('', [Validators.required]),
    });
    this.abogadoForm = new FormGroup({
      id_abogado_principal: new FormControl('', [Validators.required]),
    });
    this.clienteForm = new FormGroup({
      id_cliente: new FormControl('', [Validators.required]),
    });

    authService.getUser()?.is_admin
      ? (this.isAdmin = true)
      : (this.isAdmin = false);

    if (this.data.action === 'put' && this.data.caso) {
      this.casosForm.patchValue({
        descripcion: this.data.caso.descripcion,
        id_especialidad: this.data.caso.especialidad.id,
      });
      this.clienteForm.patchValue({
        id_cliente: this.data.caso.cliente.id,
      });
      this.abogadoForm.patchValue({
        id_abogado_principal: this.data.caso.abogado_principal.id,
      });
    }
    if (this.data.action === 'post' && !this.isAdmin) {
      this.abogadoForm.patchValue({
        id_abogado_principal: this.authService.getUser()?.id,
      });
    }
  }

  ngOnInit(): void {
    if (!this.actions.includes(this.data.action)) {
      this.snackBarService.showError('Acción no válida');
      return;
    }
    this.loadClientes();
    this.loadEspecialidades();

    if (this.isAdmin) {
      this.loadAbogados();
    }

    this.casosForm
      .get('id_especialidad')!
      .valueChanges.subscribe((idEsp: number) => {
        this.filterAbogadosByEspecialidad(idEsp);
      });
  }

  private filterAbogadosByEspecialidad(idEsp: number) {
    this.filteredAbogadosEspecialidad = this.abogados.filter((ab) =>
      ab.especialidades.some((e) => e.id === idEsp)
    );

    if (
      this.abogadoPrincipal &&
      !this.filteredAbogadosEspecialidad.some(
        (ab) => ab.id === this.abogadoPrincipal!.id
      )
    ) {
      this.filteredAbogadosEspecialidad.unshift(this.abogadoPrincipal);
    }
  }

  loadClientes(): void {
    this.clienteService.getAll().subscribe({
      next: (response) => {
        this.clientes = response.data;
        console.log('Clientes', this.clientes);
      },
      error: () => {
        this.snackBarService.showError('Error al cargar los clientes');
      },
    });
  }

  loadAbogados(): void {
    this.abogadoService.getAvailable().subscribe({
      next: (response) => {
        this.abogados = response.data;
        if (this.data.action === 'put' && this.data.caso) {
          this.loadAbogadosEnCaso(
            this.data.caso.id,
            this.data.caso.especialidad.id
          );
        }
        if (this.casosForm.get('id_especialidad')?.value) {
          this.filterAbogadosByEspecialidad(
            this.casosForm.get('id_especialidad')?.value
          );
        }
      },
      error: () =>
        this.snackBarService.showError('Error al cargar los abogados'),
    });
  }

  loadEspecialidades(): void {
    this.especialidadesService.getAll().subscribe({
      next: (response) => {
        this.especialidades = response.data;
      },
      error: () => {
        this.snackBarService.showError('Error al cargar las especialidades');
      },
    });
  }

  private loadAbogadosEnCaso(casoId: number, idEsp: number) {
    this.casosService.getAbogadosEnCaso(casoId).subscribe({
      next: (resp) => {
        const casoAbogados = resp.data || [];
        const principalItem = casoAbogados.find((item) => item.es_principal);

        if (principalItem) {
          this.abogadoPrincipal = principalItem.abogado;
          this.abogadoForm.patchValue({
            id_abogado_principal: this.abogadoPrincipal?.id,
          });
        }

        this.filterAbogadosByEspecialidad(idEsp);
      },
      error: () =>
        this.snackBarService.showError('Error al cargar los abogados del caso'),
    });
  }

  submit() {
    if (
      this.casosForm.valid &&
      this.clienteForm.valid &&
      this.abogadoForm.valid
    ) {
      const formData: ICasoCreate = {
        id_cliente: this.clienteForm.get('id_cliente')?.value,
        id_abogado_principal: this.abogadoForm.get('id_abogado_principal')
          ?.value,
        id_especialidad: this.casosForm.get('id_especialidad')?.value,
        descripcion: this.casosForm.get('descripcion')?.value,
      };
      if (this.data.action === 'post') {
        this.casosService.create(formData).subscribe({
          next: () => {
            this.snackBarService.showSuccess('Caso creado con éxito');
            this.onClose();
          },
          error: () => {
            this.snackBarService.showError('Error al crear el caso');
            this.onClose();
          },
        });
      } else if (this.data.action === 'put' && this.data.caso) {
        this.casosService.update(formData, this.data.caso?.id).subscribe({
          next: () => {
            this.snackBarService.showSuccess('Caso actualizado con éxito');
            this.onClose();
          },
          error: () => {
            this.snackBarService.showError('Error al actualizar el caso');
            this.onClose();
          },
        });
      }
    }
  }

  onDelete(): void {
    this.casosService.delete(this.data.caso!.id).subscribe({
      next: () => {
        this.snackBarService.showSuccess('Caso eliminado con éxito');
        this.onClose();
      },
      error: () => {
        this.snackBarService.showError('Error al eliminar el caso');
        this.onClose();
      },
    });
  }

  // AUXILIARES ---------------------

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'abogado') {
        this.loadAbogados();
      } else if (result === 'cliente') {
        this.loadClientes();
      } else {
        this.ngOnInit();
      }
    });
  }

  openAbogadoDialog(): void {
    this.openDialog(CRUDDialogComponent, {
      title: 'Crear Abogado',
      action: 'post',
      entityType: 'abogado',
      crudService: this.abogadoService,
    });
  }

  openClienteDialog(): void {
    this.openDialog(CRUDDialogComponent, {
      title: 'Crear Cliente',
      action: 'post',
      entityType: 'cliente',
      crudService: this.clienteService,
    });
  }

  realizarPlanPago(): void {
    const dialogRef = this.dialog.open(PlanPagoDialogComponent, {
      data: { caso: this.data.caso },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close('reload');
      }
    });
  }

  onClose() {
    this.clienteForm.reset();
    this.abogadoForm.reset();
    this.casosForm.reset();
    this.dialogRef.close(true);
  }
}

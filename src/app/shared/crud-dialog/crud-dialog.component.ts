import { Component, Inject, OnInit } from '@angular/core';
import { ICrudService } from '../../core/interfaces/ICrudService.interface.js';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SnackbarService } from '../../core/services/snackbar.service.js';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { trimValidator } from '../../core/functions/trim-validator.js';
import { passwordMatchValidator } from '../../core/functions/password-match.validators.js';
import { ISecretario } from '../../core/interfaces/ISecretario.interface.js';
import { IAbogado } from '../../core/interfaces/IAbogado.interface.js';
import { ICliente } from '../../core/interfaces/ICliente.interface.js';
import { AbogadoService } from '../../core/services/abogados.service.js';
import { SecreatarioService } from '../../core/services/secretario.service.js';
import { IEspecialidad } from '../../core/interfaces/IEspecialidad.interface.js';
import { ClienteService } from '../../core/services/cliente.service.js';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { EspecialidadesService } from '../../core/services/especialidades.service.js';

interface DialogData {
  title: string;
  action: string;
  user: ISecretario | IAbogado | ICliente;
  entityType: 'secretario' | 'abogado' | 'cliente' | 'empresa';
}

@Component({
  selector: 'app-crud-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './crud-dialog.component.html',
  styleUrl: './crud-dialog.component.css',
})
export class CRUDDialogComponent implements OnInit {
  crudService!: ICrudService<IAbogado | ICliente | ISecretario, unknown>;
  especialidades: IEspecialidad[] = [];
  selectedFile: File | null = null;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    public dialogRef: MatDialogRef<CRUDDialogComponent>,
    private snackbarService: SnackbarService,
    private abogadoService: AbogadoService,
    private secretarioService: SecreatarioService,
    private clienteService: ClienteService,
    private especialidadService: EspecialidadesService
  ) {
    this.form = new FormGroup(
      {
        nombre: new FormControl('', [Validators.required, trimValidator()]),
        apellido: new FormControl('', [Validators.required, trimValidator()]),
        email: new FormControl('', [Validators.required, Validators.email]),
        telefono: new FormControl('', [
          Validators.required,
          Validators.maxLength(20),
        ]),
        tipo_doc: new FormControl('', [Validators.required]),
        nro_doc: new FormControl('', [
          Validators.required,
          Validators.maxLength(20),
        ]),
        contrasena: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          trimValidator(),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          trimValidator(),
        ]),
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.cargarServicio();
    this.cargarEspecialidades();
    this.establecerCamposNuevos();
    if (this.dialogData.action === 'put') {
      this.rellenarFormulario();
    }
  }

  private sendFullUpdate(): void {
    if (!this.form.valid) {
      return;
    }

    const raw = { ...this.form.value };

    ['contrasena', 'confirmPassword'].forEach((key) => {
      if (!raw[key]) {
        delete raw[key];
      }
    });

    let formData: FormData | any;

    if (this.dialogData.entityType === 'abogado') {
      formData = this.buildAbogadoFormData(raw);
    } else {
      formData = raw;
    }

    const isCreate = this.dialogData.action === 'post';
    const id = this.dialogData.user?.id!;
    const servicio = isCreate
      ? this.crudService.create(formData)
      : this.crudService.update(id, formData);

    const entidad = this.dialogData.entityType;
    const titulo = isCreate ? 'Crear' : 'Actualizar';

    servicio.subscribe({
      next: (response) => {
        this.snackbarService.showSuccess(
          `¡${titulo} ${entidad} exitosamente!`,
          5000
        );
        if (this.dialogData.entityType === 'abogado') {
          this.dialogRef.close('abogado');
        } else if (this.dialogData.entityType === 'cliente') {
          this.dialogRef.close('cliente');
        } else {
          this.dialogRef.close();
        }
      },
      error: (err) => {
        this.snackbarService.showError(
          err.error.isUserFriendly
            ? err.error.message
            : 'Error al crear el usuario',
          5000
        );
      },
    });
  }

  onSubmit(): void {
    if (['post', 'put'].includes(this.dialogData.action)) {
      this.sendFullUpdate();
    }
  }

  onClose(): void {
    this.dialogRef.close('none');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    this.selectedFile = file;

    this.form.get('foto')!.setValue(file);
  }

  // AUXILIARES -----------------------------------------------------------------

  private cargarServicio() {
    switch (this.dialogData.entityType) {
      case 'abogado':
        this.crudService = this.abogadoService;
        break;
      case 'cliente':
      case 'empresa':
        this.crudService = this.clienteService;
        break;
      case 'secretario':
        this.crudService = this.secretarioService;
        break;
      default:
        break;
    }
  }

  private cargarEspecialidades(): void {
    this.especialidadService.getAll().subscribe({
      next: (res) => {
        this.especialidades = res.data;
      },
      error: (err) => {
        console.error('Error cargando especialidades', err);
        this.snackbarService.showError(
          err.error.isUserFriendly
            ? err.error.message
            : 'Error al cargar especialidades',
          5000
        );
      },
    });
  }

  private establecerCamposNuevos(): void {
    switch (this.dialogData.entityType) {
      case 'abogado':
        this.form.addControl(
          'matricula',
          new FormControl<string>('', Validators.required)
        );
        this.form.addControl(
          'id_rol',
          new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(1),
          ])
        );
        this.form.addControl(
          'especialidades',
          new FormControl<number[]>([], Validators.required)
        );
        this.form.addControl(
          'foto',
          new FormControl<File | null>(null, Validators.required)
        );
        break;

      case 'cliente':
        this.form.addControl(
          'es_empresa',
          new FormControl<boolean>(false, Validators.required)
        );
        break;

      case 'secretario':
        this.form.addControl(
          'turno_trabajo',
          new FormControl<string>('', Validators.required)
        );
        break;

      case 'empresa':
        this.form.addControl(
          'es_empresa',
          new FormControl<boolean>(true, Validators.required)
        );
        this.form.get('apellido')!.disable();
        this.form.get('apellido')!.clearValidators();
        this.form.get('apellido')!.updateValueAndValidity();
        break;

      default:
        throw new Error(
          `Tipo de entidad desconocido: ${this.dialogData.entityType}`
        );
    }
  }

  private rellenarFormulario(): void {
    const user = this.dialogData.user;
    if (!user) {
      return;
    }

    this.form.patchValue({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      tipo_doc: user.tipo_doc,
      nro_doc: user.nro_doc,
    });

    ['contrasena', 'confirmPassword'].forEach((field) => {
      const ctrl = this.form.get(field)!;
      ctrl.clearValidators();
      ctrl.updateValueAndValidity();
      ctrl.setValue('');
    });

    switch (this.dialogData.entityType) {
      case 'abogado':
        this.form.patchValue({
          matricula: (user as IAbogado).matricula,
          id_rol: (user as IAbogado).rol.id,
          foto: (user as IAbogado).foto,
        });

        (this.crudService as AbogadoService)
          .findEspecialidad(user.id!)
          .subscribe({
            next: (res) => {
              const idsEspecialidades = res.data.map(
                (e: IEspecialidad) => e.id
              );

              this.form.get('especialidades')?.setValue(idsEspecialidades);
            },
            error: (err) => console.error('Error cargando especialidades', err),
          });
        break;

      case 'cliente':
        this.form.patchValue({
          es_empresa: (user as ICliente).es_empresa,
        });
        break;

      case 'secretario':
        this.form.patchValue({
          turno_trabajo: (user as ISecretario).turno_trabajo,
        });
        break;

      case 'empresa':
        this.form.patchValue({
          es_empresa: (user as ICliente).es_empresa,
        });
        break;

      default:
        throw new Error(
          `Tipo de entidad desconocido: ${this.dialogData.entityType}`
        );
    }
  }

  private buildAbogadoFormData(raw: any): FormData {
    const fd = new FormData();

    [
      'nombre',
      'apellido',
      'email',
      'telefono',
      'tipo_doc',
      'nro_doc',
      'matricula',
    ].forEach((key) => {
      if (raw[key] != null) {
        fd.append(key, String(raw[key]));
      }
    });

    if (raw.id_rol != null) {
      fd.append('id_rol', String(Number(raw.id_rol)));
    }

    if (raw.especialidades != null) {
      const especialidades = Array.isArray(raw.especialidades)
        ? raw.especialidades
        : [raw.especialidades];

      const ids = especialidades
        .map((v: any) => Number(v))
        .filter((n: number) => Number.isInteger(n) && n > 0);

      fd.append('especialidades', JSON.stringify(ids));
    }

    const foto = raw.foto;
    if (foto instanceof File) {
      fd.append('foto', foto, foto.name);
    }

    if (raw.contrasena) {
      fd.append('contrasena', raw.contrasena);
    }

    return fd;
  }

  isEmpresa(): boolean {
    return this.dialogData.entityType === 'empresa';
  }
}

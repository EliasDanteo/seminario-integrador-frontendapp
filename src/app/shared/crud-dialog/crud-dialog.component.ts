import { Component, Inject, NgModule } from '@angular/core';
import { ICrudService } from '../../core/services/crud-service.interface.js';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../core/services/snackbar.service.js';
import {
  FormControl,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { trimValidator } from '../../core/functions/trim-validator.js';
import { passwordMatchValidator } from '../../core/functions/password-match.validators.js';
import { ISecretario } from '../../core/interfaces/ISecretario.interface.js';
import { IAbogado } from '../../core/interfaces/IAbogado.interface.js';
import { ICliente } from '../../core/interfaces/ICliente.interface.js';

interface DialogData {
  title: string;
  action: string;
  user: ISecretario | IAbogado | ICliente;
  entityType: 'secretario' | 'abogado' | 'cliente' | 'empresa';
  crudService: ICrudService<IAbogado | ICliente | ISecretario, unknown>;
}

@Component({
  selector: 'app-crud-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crud-dialog.component.html',
  styleUrl: './crud-dialog.component.css',
})
export class CRUDDialogComponent {
  title: string;
  action: string;
  userId: string | undefined;
  crudService: ICrudService<IAbogado | ICliente | ISecretario, unknown>;
  entityType: 'secretario' | 'abogado' | 'cliente' | 'empresa';
  selectedFile: File | null = null;

  form = new FormGroup<any>(
    {
      nombre: new FormControl('', [Validators.required, trimValidator()]),
      apellido: new FormControl('', [Validators.required, trimValidator()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required]),
      tipo_doc: new FormControl('', [Validators.required]),
      nro_doc: new FormControl('', [Validators.required]),
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
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    public dialogRef: MatDialogRef<CRUDDialogComponent>,
    private snackbarService: SnackbarService
  ) {
    console.log(dialogData);
    this.title = dialogData.title;
    this.action = dialogData.action;
    this.crudService = dialogData.crudService;
    this.entityType = dialogData.entityType;

    //ABOGADO
    console.log('entityType:', this.entityType);
    if (this.entityType === 'abogado') {
      this.form.addControl(
        'matricula',
        new FormControl('', Validators.required)
      );
      this.form.addControl(
        'id_rol',
        new FormControl(null, [Validators.required, Validators.min(1)])
      );
      this.form.addControl(
        'especialidades',
        new FormControl([], [Validators.required])
      );
      this.form.addControl(
        'foto',
        new FormControl(null, [Validators.required])
      );
    }

    //CLIENTE
    else if (this.entityType === 'cliente') {
      this.form.addControl(
        'es_empresa',
        new FormControl('', Validators.required)
      );
    }
    // SECRETARIO
    else if (this.entityType === 'secretario') {
      this.form.addControl(
        'turno_trabajo',
        new FormControl('', Validators.required)
      );
    }
    //EMPRESA
    else if (this.entityType === 'empresa') {
      this.form.addControl('es_empresa', new FormControl(true));
      this.form.get('es_empresa')?.setValue(true);
      this.form.get('apellido')?.disable();
      this.form.get('apellido')?.setValue(null);
      this.form.get('apellido')?.clearValidators();
    }

    // FOR UPDATES
    if (dialogData.user !== undefined) {
      const form = this.form.controls;

      this.userId = dialogData.user.id;
      form['nombre'].setValue(dialogData.user.nombre);
      form['apellido'].setValue(dialogData.user.apellido);
      form['email'].setValue(dialogData.user.email);
      form['telefono'].setValue(dialogData.user.telefono);
      form['tipo_doc'].setValue(dialogData.user.tipo_doc);
      form['nro_doc'].setValue(dialogData.user.nro_doc);
      form['contrasena'].setValue('');
      form['contrasena'].clearValidators();
      form['confirmPassword'].setValue('');
      form['confirmPassword'].clearValidators();

      //ABOGADO
      if (
        this.entityType === 'abogado' &&
        'matricula' in dialogData.user &&
        'rol' in dialogData.user
      ) {
        form['matricula'].setValue(dialogData.user.matricula);
        console.log(dialogData.user.rol, dialogData.user.especialidades);
        form['id_rol'].setValue(dialogData.user.rol.id);
        if ('especialidades' in dialogData.user) {
          //TODO: el findall no me trae las especialidedes
          form['especialidades'].setValue(dialogData.user.especialidades);
        }
      }
      //CLIENTE
      else if (
        this.entityType === 'cliente' &&
        'es_empresa' in dialogData.user
      ) {
        form['es_empresa'].setValue(dialogData.user.es_empresa);
      }
      //SECRETARIO
      else if (
        this.entityType === 'secretario' &&
        'turno_trabajo' in dialogData.user
      ) {
        form['turno_trabajo'].setValue(dialogData.user.turno_trabajo);
      }
      //EMPRESA
      else if (
        this.entityType === 'empresa' &&
        'es_empresa' in dialogData.user
      ) {
        form['es_empresa'].setValue(dialogData.user.es_empresa);
      }
    }
  }

  sendFullUpdate() {
    if (this.form.valid) {
      const formData = { ...this.form.value };

      if (!formData.contrasena) {
        delete formData.contrasena;
      }
      if (!formData.confirmPassword) {
        delete formData.confirmPassword;
      }
      if (this.dialogData.entityType === 'abogado') {
        if (!Array.isArray(formData.especialidades)) {
          formData.especialidades = [formData.especialidades];
        }
        if (this.action === 'post') {
          console.log('form data:', formData);
          this.crudService.create(formData as IAbogado).subscribe({
            next: (response) => {
              console.log(formData);
              this.snackbarService.showSuccess('¡Creado Exitosamente!', 5000);
              this.dialogRef.close(response);
            },
          });
        }
        if (this.action === 'put') {
          this.crudService.update(this.userId!, formData).subscribe({
            next: (response) => {
              this.snackbarService.showSuccess('¡Actualización Exitosa!', 5000);
              this.dialogRef.close(response);
            },
          });
        }
      }
      if (this.dialogData.entityType === 'cliente') {
        if (this.action === 'post') {
          this.crudService.create(formData as ICliente).subscribe({
            next: (response) => {
              this.snackbarService.showSuccess('¡Creado Exitosamente!', 5000);
              this.dialogRef.close(response);
            },
          });
        }
        if (this.action === 'put') {
          this.crudService.update(this.userId!, formData).subscribe({
            next: (response) => {
              this.snackbarService.showSuccess('¡Actualización Exitosa!', 5000);
              this.dialogRef.close(response);
            },
          });
        }
      }
      if (this.dialogData.entityType === 'secretario') {
        if (this.action === 'post') {
          this.crudService.create(formData as ISecretario).subscribe({
            next: (response) => {
              this.snackbarService.showSuccess('¡Creado Exitosamente!', 5000);
              this.dialogRef.close(response);
            },
          });
        }
        if (this.action === 'put') {
          this.crudService.update(this.userId!, formData).subscribe({
            next: (response) => {
              this.snackbarService.showSuccess('¡Actualización Exitosa!', 5000);
              this.dialogRef.close(response);
            },
          });
        }
      }
      if (this.dialogData.entityType === 'empresa') {
        if (this.action === 'post') {
          this.crudService.create(formData as ICliente).subscribe({
            next: (response) => {
              this.snackbarService.showSuccess('¡Creado Exitosamente!', 5000);
              this.dialogRef.close(response);
            },
          });
        }
        if (this.action === 'put') {
          this.crudService.update(this.userId!, formData).subscribe({
            next: (response) => {
              this.snackbarService.showSuccess('¡Actualización Exitosa!', 5000);
              this.dialogRef.close(response);
            },
          });
        }
      }
    }
  }

  OnSubmit() {
    if (this.action === 'post' || this.action === 'put') {
      this.sendFullUpdate();
    }
  }

  onClose(): void {
    this.snackbarService.showError('Cancelando', 5000);
    this.dialogRef.close('none');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.form.patchValue({ foto: this.selectedFile });
      this.form.get('foto')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
    }
  }
}

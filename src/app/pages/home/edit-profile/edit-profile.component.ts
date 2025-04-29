import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  hidePassword = true;
  profileForm!: FormGroup;
  user: any = null;
  isAdmin: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditProfileComponent>,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.user = this.data.user || null;
    this.isAdmin = this.data.user.is_admin || false;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.profileForm = this.fb.group(
      {
        email: [
          this.data.user?.email || '',
          [Validators.required, Validators.email],
        ],
        telefono: [this.data.user?.telefono || ''],
        currentPassword: [''],
        newPassword: ['', [Validators.minLength(4)]],
        confirmPassword: [''],
      },
      {
        validators: [
          this.passwordMatchValidator,
          this.passwordDifferentValidator,
        ],
      }
    );
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword || confirmPassword) {
      return newPassword === confirmPassword
        ? null
        : { passwordMismatch: true };
    }
    return null;
  }

  passwordDifferentValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const currentPassword = control.get('currentPassword')?.value;
    const newPassword = control.get('newPassword')?.value;

    if (currentPassword && newPassword && currentPassword === newPassword) {
      return { samePassword: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open(
        'Por favor complete los campos requeridos correctamente',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    const formValue = this.profileForm.value;

    if (formValue.newPassword && !formValue.currentPassword) {
      this.snackBar.open(
        'Debe ingresar la contraseña actual para cambiarla',
        'Cerrar',
        {
          duration: 3000,
        }
      );
      return;
    }

    const updateData = {
      email: formValue.email,
      telefono: formValue.telefono,
      contrasena: formValue.newPassword || undefined,
      contrasena_anterior: formValue.currentPassword || undefined,
    };

    this.usuarioService
      .selfUpdate(
        updateData.email,
        updateData.telefono,
        updateData.contrasena,
        updateData.contrasena_anterior
      )
      .subscribe({
        next: (response) => {
          this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
            duration: 3000,
          });
          this.dialogRef.close(response.data);
        },
        error: (err) => {
          const errorMessage =
            err.error?.message || 'Error al actualizar el perfil';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  shouldShowPasswordErrors(): boolean {
    const form = this.profileForm;
    return (
      (form.get('newPassword')?.value || form.get('confirmPassword')?.value) &&
      (form.hasError('passwordMismatch') || form.hasError('samePassword'))
    );
  }

  getPasswordErrorMessage(): string {
    if (this.profileForm.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }
    if (this.profileForm.hasError('samePassword')) {
      return 'La nueva contraseña no puede ser igual a la actual';
    }
    return '';
  }
}

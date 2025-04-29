import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  isAdmin: boolean;
  hidePassword = true;
  service: any = null;
  user: any = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditProfileComponent>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.isAdmin = this.data.user?.is_admin || false;
    this.user = this.data.user;
    this.service = this.data.service;
  }

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    // Main profile form
    this.profileForm = this.fb.group({
      nombre: [this.data.user?.nombre || '', Validators.required],
      apellido: [this.data.user?.apellido || '', Validators.required],
      email: [
        this.data.user?.email || '',
        [Validators.required, Validators.email],
      ],
      telefono: [this.data.user?.telefono || ''],
      tipo_doc: [this.data.user?.tipo_doc || 'DNI'],
      nro_doc: [this.data.user?.nro_doc || '', Validators.required],
      ...(this.data.user?.matricula && {
        matricula: [this.data.user.matricula, Validators.required],
      }),
      ...(this.data.user?.turno_trabajo && {
        turno_trabajo: [this.data.user.turno_trabajo],
      }),
    });

    // Password form (now always visible)
    this.passwordForm = this.fb.group(
      {
        currentPassword: [''],
        newPassword: ['', [Validators.minLength(6)]],
        confirmPassword: ['', [Validators.minLength(6)]],
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;

    // Only validate if new password has value
    if (newPass || confirmPass) {
      return newPass === confirmPass ? null : { notSame: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.isAdmin && this.profileForm.valid) {
      this.service.update(this.data.user.id, this.profileForm.value).subscribe({
        next: (updatedUser: any) => {
          this.dialogRef.close(updatedUser);
        },
        error: (err: any) => {
          console.error('Error updating profile:', err);
        },
      });
    }
  }

  onChangePassword(): void {
    if (
      this.passwordForm.valid &&
      this.passwordForm.value.currentPassword &&
      this.passwordForm.value.newPassword
    ) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      //TODO: Call the change password service method

      /* 
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.dialogRef.close('password_changed');
        },
        error: (err) => {
          console.error('Error changing password:', err);
        },
      });
      */
    }
  }

  onCancel(): void {
    this.dialogRef.close('none');
  }
}

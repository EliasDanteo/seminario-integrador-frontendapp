import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordService } from '../../core/services/forgot-password.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  newPassword = '';
  confirmPassword = '';
  code: string | null = null;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: ForgotPasswordService,
    private snackBarService: SnackbarService
  ) {
    this.code = this.route.snapshot.queryParamMap.get('codigo');

    if (!this.code) {
      this.snackBarService.showError('Enlace inválido o faltante');
      this.router.navigate(['/forgot-password']);
    }
  }

  async onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBarService.showError('Las contraseñas no coinciden');
      return;
    }

    if (this.newPassword.length < 5) {
      this.snackBarService.showError(
        'La contraseña debe tener al menos 5 caracteres'
      );
      return;
    }

    try {
      if (!this.code) {
        throw new Error('Código de verificación no válido');
      }

      await this.authService
        .resetPassword(this.code, this.newPassword)
        .toPromise();

      this.success = true;
      this.snackBarService.showSuccess('Contraseña actualizada correctamente');

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error.error?.message || 'Error al actualizar la contraseña';
      this.snackBarService.showError(errorMessage);

      if (error.status === 400 || error.status === 404) {
        setTimeout(() => {
          this.router.navigate(['/forgot-password']);
        }, 2000);
      }
    }
  }
}

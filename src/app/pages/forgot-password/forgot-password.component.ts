import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordService } from '../../core/services/forgot-password.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';
  isLoading = false;

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.email.includes('@')) {
      this.error = 'Por favor ingresa un email válido';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.message = '';

    this.forgotPasswordService.sendResetLink(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message =
          response.message ||
          'Se ha enviado un enlace de recuperación a tu email';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error =
          err.error?.message || 'Error al enviar el enlace de recuperación';
      },
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService, ILogin } from '../../core/services/auth.service.js';
import { Route, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '../../core/services/snackbar.service.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private snackbarService: SnackbarService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.snackbarService.showError('Por favor, completa todos los campos.');
      return;
    }
    const form = this.loginForm.value;

    const data: ILogin = { email: form.email!, contrasena: form.password! };

    this.authService.login(data).subscribe({
      next: () => {
        this.router.navigate(['/noticias-blog']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.snackbarService.showError(
            'Correo electrónico y/o contraseña incorrectos.'
          );
        } else {
          this.snackbarService.showError('Error al iniciar sesión.');
        }
      },
    });
  }
}

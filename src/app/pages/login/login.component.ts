import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService, ILogin } from '../../core/services/auth.service.js';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '../../core/services/snackbar.service.js';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private snackbarService: SnackbarService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    if (this.authService.getUser() !== null) {
      this.router.navigate(['/home']);
    } else {
      if (await this.authService.extendSession())
        this.router.navigate(['/home']);
    }
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
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.snackbarService.showError(
            err.error.isUserFriendly
              ? err.error.message
              : 'Contraseña y/o email incorrectos.'
          );
        } else {
          this.snackbarService.showError('Error al iniciar sesión.');
        }
      },
    });
  }
}

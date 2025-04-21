import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Cerrar', {
      duration: duration,
      panelClass: ['success-snackbar'],
    });
  }

  showInfo(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Cerrar', {
      duration: duration,
      panelClass: ['info-snackbar'],
    });
  }

  showError(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Cerrar', {
      duration: duration,
      panelClass: ['error-snackbar'],
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { turnoOtorgadoService } from '../../core/services/turnoOtorgado.service.js';
import { AuthService } from '../../core/services/auth.service.js';
import { SnackbarService } from '../../core/services/snackbar.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turnos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turnos-list.component.html',
  styleUrl: './turnos-list.component.css',
})
export class TurnosListComponent implements OnInit {
  public turnos: any[] = [];
  usuario: any;

  constructor(
    private turnoOtorgadoService: turnoOtorgadoService,
    private authService: AuthService,
    private snackBarService: SnackbarService
  ) {
    this.usuario = this.authService.getUser();
  }

  ngOnInit(): void {
    this.loadTurnos();
  }

  loadTurnos(): void {
    this.turnoOtorgadoService.findByAbogado(this.usuario.id).subscribe({
      next: (response) => {
        console.log('Turnos:', response.data);
        this.turnos = response.data;
      },
      error: (err) => {
        if (err.error.isUserFriendly) {
          this.snackBarService.showError(err.error.message);
        } else this.snackBarService.showError('Error al cargar los clientes');
      },
    });
  }
}

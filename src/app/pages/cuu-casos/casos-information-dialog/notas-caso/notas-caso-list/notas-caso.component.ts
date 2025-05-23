import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { INota } from '../../../../../core/interfaces/INota.interface.js';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import { environment } from '../../../../../../environments/environment.js';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { NotasCasoDialogComponent } from '../notas-caso-dialog/notas-caso-dialog.component.js';
import { AuthService } from '../../../../../core/services/auth.service.js';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component.js';

@Component({
  selector: 'app-notas-caso',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './notas-caso.component.html',
  styleUrl: './notas-caso.component.css',
})
export class NotasCasoComponent implements OnInit {
  notasCaso: INota[] = [];
  usuario: any = null;

  @Input() caso!: ICaso;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.usuario = this.authService.getUser();
  }

  ngOnInit(): void {
    this.loadNotasCaso();
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadNotasCaso();
      }
    });
  }

  loadNotasCaso() {
    this.httpClient
      .get<{ message: string; data: INota[] }>(
        `${environment.casosUrl}/notas/${this.caso.id}`
      )
      .subscribe({
        next: (response) => {
          this.notasCaso = this.marcarEliminables(response.data);
        },
        error: (err) => {
          this.snackBarService.showError(
            err.error.isuserFriendly
              ? err.error.message
              : 'Error cargando notas'
          );
        },
      });
  }

  openCreateDialog(): void {
    this.openDialog(NotasCasoDialogComponent, {
      action: 'post',
      nota: null,
      caso: this.caso,
    });
  }

  openEditDialog(nota: INota): void {
    this.openDialog(NotasCasoDialogComponent, {
      action: 'put',
      nota: nota,
      caso: null,
    });
  }

  openDeleteDialog(nota: INota) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: nota.titulo,
        entidad: 'Nota',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.deleteNota(nota);
      }
    });
  }

  deleteNota(nota: INota) {
    this.httpClient
      .delete<{ message: string }>(`${environment.casosUrl}/notas/${nota.id}`)
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.loadNotasCaso();
        },
        error: (err) => {
          this.snackBarService.showError(
            err.error.isuserFriendly
              ? err.error.message
              : 'Error al eliminar la nota'
          );
        },
      });
  }

  private marcarEliminables(notas: INota[]): INota[] {
    const ahora = new Date();

    return notas.map((nota) => {
      const fechaComentario = new Date(nota.fecha_hora);
      const diferenciaHoras =
        (ahora.getTime() - fechaComentario.getTime()) / (1000 * 60 * 60);

      nota.sePuedeEliminar = diferenciaHoras <= 2;

      return nota;
    });
  }

  validarPermisos() {
    return this.caso.abogados_activos.some(
      (abogado) => abogado.id === this.usuario.id
    );
  }
}

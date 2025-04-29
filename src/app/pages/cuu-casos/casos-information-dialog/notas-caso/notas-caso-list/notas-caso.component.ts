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

@Component({
  selector: 'app-notas-caso',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './notas-caso.component.html',
  styleUrl: './notas-caso.component.css',
})
export class NotasCasoComponent implements OnInit {
  notasCaso: INota[] = [];
  formNota: FormGroup;
  usuario: any = null;

  @Input() caso!: ICaso;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.formNota = new FormGroup({
      titulo: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
    });
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
          this.notasCaso = response.data;
          console.log(this.notasCaso);
        },
        error: (error) => {
          this.snackBarService.showError('Error al cargar las notas del caso');
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
    if (!nota) {
      console.error('Nota no disponible');
      return;
    }
    const abogadoData = localStorage.getItem('abogado');
    if (!abogadoData) {
      this.snackBarService.showError('No se reconoce el abogado en la sesión');
      return;
    }
    const parsedAbogado = JSON.parse(abogadoData);

    if (nota.abogado.id !== parsedAbogado.id) {
      this.snackBarService.showError('Solo el autor puede editar esta nota');
      return;
    }

    if (!this.validarHora(nota)) {
      this.snackBarService.showError(
        'No puedes editar esta nota, han pasado más de 2 horas desde su creación'
      );
      return;
    }

    this.openDialog(NotasCasoDialogComponent, {
      action: 'put',
      nota: nota,
      caso: null,
    });
  }

  deleteNota(nota: INota) {
    if (!this.validarHora(nota)) {
      this.snackBarService.showError(
        'No puedes eliminar esta nota, han pasado más de 2 horas desde su creación'
      );
      return;
    }
    this.httpClient
      .delete<{ message: string }>(`${environment.casosUrl}/notas/${nota.id}`)
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.loadNotasCaso();
        },
        error: () => {
          this.snackBarService.showError('Error al eliminar la nota');
        },
      });
  }

  private validarHora(nota: INota): boolean {
    const fechaCreacion = new Date(nota.fecha_hora);
    const diferenciaMs = Date.now() - fechaCreacion.getTime();
    return diferenciaMs <= 120 * 60 * 1000;
  }
}

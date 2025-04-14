import { Component, Input, OnInit } from '@angular/core';
import { ICaso } from '../../../../core/interfaces/ICaso.interface.js';
import { IRecordatorio } from '../../../../core/interfaces/IRecordatorio.interface.js';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../../services/snackbar.service.js';
import { environment } from '../../../../../environments/environment.js';
import { RecordatoriosDialogComponent } from '../recordatorios-dialog/recordatorios-dialog.component.js';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { IAbogadoCaso } from '../../../../core/interfaces/IAbogadoCaso.interface.js';

@Component({
  selector: 'app-recordatorios-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './recordatorios-list.component.html',
  styleUrl: './recordatorios-list.component.css',
})
export class RecordatoriosListComponent implements OnInit {
  recordatoriosCaso: IRecordatorio[] = [];
  abogadosActivos: IAbogadoCaso[] = [];
  currentDate: Date = new Date();

  @Input() caso!: ICaso;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadRecordatorios();
      }
    });
  }

  ngOnInit(): void {
    this.loadAbogadosActivos();
    this.loadRecordatorios();
  }

  loadRecordatorios() {
    this.httpClient
      .get<{ message: string; data: IRecordatorio[] }>(
        `${environment.casosUrl}/recordatorios/${this.caso.id}`
      )
      .subscribe({
        next: (response) => {
          this.recordatoriosCaso = response.data.map((recordatorio) => {
            return {
              ...recordatorio,
              vencido:
                new Date(recordatorio.fecha_hora_limite) < this.currentDate,
            };
          });
        },
        error: (err) => {
          this.snackBarService.showError('Error al cargar recordatorios');
          console.error(err);
        },
      });
  }

  openCreateDialog() {
    /*if (this.validarPermisosAbogado()) {
      this.openDialog(RecordatoriosDialogComponent, {
        action: 'post',
        caso: this.caso,
        recordatorio: null,
      });
    }*/
    this.openDialog(RecordatoriosDialogComponent, {
      action: 'post',
      caso: this.caso,
      recordatorio: null,
    });
  }

  openEditDialog(recordatorio: IRecordatorio) {
    /*if (this.validarPermisosAbogado()) {
      this.openDialog(RecordatoriosDialogComponent, {
        action: 'put',
        caso: this.caso,
        recordatorio: recordatorio,
      });
    }*/
    this.openDialog(RecordatoriosDialogComponent, {
      action: 'put',
      caso: this.caso,
      recordatorio: recordatorio,
    });
  }

  deleteRecordatorio(recordatorio: IRecordatorio) {
    if (!this.validarPermisosAbogado()) {
      return;
    }
    this.httpClient
      .delete<{ message: string; data: IRecordatorio }>(
        `${environment.casosUrl}/recordatorios/${recordatorio.id}`
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.loadRecordatorios();
        },
        error: (err) => {
          this.snackBarService.showError('Error al eliminar recordatorio');
          console.error(err);
        },
      });
  }

  loadAbogadosActivos() {
    this.httpClient
      .get<{ message: string; data: IAbogadoCaso[] }>(
        `${environment.casosUrl}/${this.caso.id}/abogados`
      )
      .subscribe({
        next: (response) => {
          this.abogadosActivos = response.data;
        },
        error: () => {
          this.snackBarService.showError('Error al cargar abogados activos');
        },
      });
  }

  validarPermisosAbogado(): boolean {
    const abogado = localStorage.getItem('abogado');
    if (abogado) {
      const abogadoData = JSON.parse(abogado);
      const tienePermisos = this.abogadosActivos.some(
        (abogadoActivo) => abogadoActivo.id === abogadoData.id
      );
      if (!tienePermisos) {
        this.snackBarService.showError(
          'No tienes permisos para realizar esa accion'
        );
        return false;
      }
      return true;
    } else {
      this.snackBarService.showError('No se encontró el abogado en la sesión');
      return false;
    }
  }
}

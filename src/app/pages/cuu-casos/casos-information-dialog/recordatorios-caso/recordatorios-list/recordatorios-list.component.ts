import { Component, Input, OnInit } from '@angular/core';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import { IRecordatorio } from '../../../../../core/interfaces/IRecordatorio.interface.js';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { environment } from '../../../../../../environments/environment.js';
import { RecordatoriosDialogComponent } from '../recordatorios-dialog/recordatorios-dialog.component.js';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { IAbogadoCaso } from '../../../../../core/interfaces/IAbogadoCaso.interface.js';
import { AuthService } from '../../../../../core/services/auth.service.js';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component.js';

@Component({
  selector: 'app-recordatorios-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule],
  templateUrl: './recordatorios-list.component.html',
  styleUrl: './recordatorios-list.component.css',
})
export class RecordatoriosListComponent implements OnInit {
  recordatoriosCasoPasados: IRecordatorio[] = [];
  recordatoriosCasoVigentes: IRecordatorio[] = [];
  currentDate: Date = new Date();

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
    this.loadRecordatorios();
  }

  loadRecordatorios() {
    this.httpClient
      .get<{
        message: string;
        data: {
          recordatoriosPasados: IRecordatorio[];
          recordatoriosFuturos: IRecordatorio[];
        };
      }>(`${environment.casosUrl}/recordatorios/${this.caso.id}`)
      .subscribe({
        next: (response) => {
          console.log(response.data);
          this.recordatoriosCasoPasados = response.data.recordatoriosPasados;
          this.recordatoriosCasoVigentes = response.data.recordatoriosFuturos;
        },
        error: (err) => {
          this.snackBarService.showError(err.error.message);
        },
      });
  }

  openCreateDialog() {
    this.openDialog(RecordatoriosDialogComponent, {
      action: 'post',
      caso: this.caso,
      recordatorio: null,
    });
  }

  openEditDialog(recordatorio: IRecordatorio) {
    this.openDialog(RecordatoriosDialogComponent, {
      action: 'put',
      caso: this.caso,
      recordatorio: recordatorio,
    });
  }

  openDeleteDialog(recordatorio: IRecordatorio) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: recordatorio.descripcion,
        entidad: 'Recordatorio',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.deleteRecordatorio(recordatorio);
      }
    });
  }

  deleteRecordatorio(recordatorio: IRecordatorio) {
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

  validarPermisos() {
    return this.caso.abogados_activos.some(
      (abogado) => abogado.id === this.usuario.id
    );
  }
}

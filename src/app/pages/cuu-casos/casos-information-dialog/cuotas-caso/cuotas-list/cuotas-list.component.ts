import { Component, Input, OnInit } from '@angular/core';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import { ICuota } from '../../../../../core/interfaces/ICuota.interface.js';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { CommonModule } from '@angular/common';
import { CuotasCasoService } from '../../../../../core/services/cuotas-caso.service.js';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { CuotasDialogComponent } from '../cuotas-dialog/cuotas-dialog.component.js';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component.js';

@Component({
  selector: 'app-cuotas-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
  ],
  templateUrl: './cuotas-list.component.html',
  styleUrl: './cuotas-list.component.css',
})
export class CuotasListComponent implements OnInit {
  @Input() caso!: ICaso;
  cuotas: ICuota[] = [];
  currentDate: Date = new Date();

  constructor(
    private cuotasCasoService: CuotasCasoService,
    private snackBarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCuotas();
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadCuotas();
      }
    });
  }

  loadCuotas() {
    this.cuotasCasoService.getAllByCaso(this.caso.id).subscribe({
      next: (res) => {
        this.cuotas = res.data;
      },
      error: (err) => {
        this.snackBarService.showError(
          err.error.isUserFriendly
            ? err.error.message
            : 'Error al cargar cuotas'
        );
      },
    });
  }

  estaVencida(cuota: ICuota): boolean {
    return new Date(cuota.fecha_vencimiento) < this.currentDate;
  }

  cobrarCuota() {
    this.openDialog(CuotasDialogComponent, {
      caso: this.caso,
    });
  }

  ultimaCuotaPagada(): ICuota | null {
    const cuotasPagadas = this.cuotas
      .filter((cuota) => cuota.fecha_hora_cobro)
      .sort(
        (a, b) =>
          new Date(b.fecha_hora_cobro!).getTime() -
          new Date(a.fecha_hora_cobro!).getTime()
      );

    return cuotasPagadas[0] || null;
  }

  openDeleteDialog(cuota: ICuota | null) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: cuota?.numero,
        entidad: 'Cuota Numero',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.eliminarCobroCuota();
      }
    });
  }

  eliminarCobroCuota() {
    this.cuotasCasoService.deleteFee(this.caso.id).subscribe({
      next: (res) => {
        this.snackBarService.showSuccess(res.message);
        this.loadCuotas();
      },
      error: (res) => {
        if (res.status === 400) {
          this.snackBarService.showError(
            'No existen cuotas del caso o ninguna fue cobrada.'
          );
        } else {
          this.snackBarService.showError('Error al eliminar la cuota');
        }
      },
    });
  }
}

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
      error: () => {
        this.snackBarService.showError('Error al cargar las cuotas');
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

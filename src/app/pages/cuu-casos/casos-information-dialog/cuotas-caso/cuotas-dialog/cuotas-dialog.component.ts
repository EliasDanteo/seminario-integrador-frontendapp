import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { ICuota } from '../../../../../core/interfaces/ICuota.interface.js';
import { CuotasCasoService } from '../../../../../core/services/cuotas-caso.service.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JusService } from '../../../../../core/services/jus.service.js';
import { ICuotaCreate } from '../../../../../core/services/cuotas-caso.service.js';
@Component({
  selector: 'app-cuotas-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cuotas-dialog.component.html',
  styleUrl: './cuotas-dialog.component.css',
})
export class CuotasDialogComponent implements OnInit {
  ultimaCuota: ICuota | null = null;
  precioJus: number = 0;
  formas: string[] = [
    'Efectivo',
    'Transferencia',
    'Cheque',
    'Crédito',
    'Débito',
  ];
  cuotaForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { caso: ICaso },
    private snackBarService: SnackbarService,
    private cuotasService: CuotasCasoService,
    private jusService: JusService,
    public dialogRef: MatDialogRef<CuotasDialogComponent>
  ) {
    this.cuotaForm = new FormGroup({
      forma_cobro: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.buscarPrecioJus();
    this.buscarSiguienteCuota();
  }

  buscarPrecioJus() {
    this.jusService.getJusPrice().subscribe({
      next: (response) => {
        if (response.data) {
          this.precioJus = response.data.valor;
        } else {
          this.snackBarService.showError('No se encontró el precio del Jus');
        }
      },
      error: (err) => {
        this.snackBarService.showError(
          err.error.isUserFriendly
            ? err.error.message
            : 'Error al buscar el precio del Jus'
        );
      },
    });
  }

  buscarSiguienteCuota() {
    this.cuotasService.getNextFee(this.data.caso.id).subscribe({
      next: (response) => {
        if (response.data) {
          this.ultimaCuota = response.data;
        } else {
          this.snackBarService.showError('No se encontró la última cuota');
        }
      },
      error: (err) => {
        this.snackBarService.showError(
          err.error.isUserFriendly
            ? err.error.message
            : 'Error al buscar la última cuota'
        );
      },
    });
  }

  calcularImporteCuota(): number | null {
    if (this.ultimaCuota) {
      const cantidadJus = this.ultimaCuota.cant_jus;
      return this.precioJus * cantidadJus;
    }
    return null;
  }

  cobrarCuota() {
    if (this.ultimaCuota) {
      if (this.cuotaForm.valid) {
        const cuota: ICuotaCreate = {
          forma_cobro: this.cuotaForm.value.forma_cobro,
        };
        this.cuotasService
          .createFee(cuota, this.data.caso.id, this.ultimaCuota?.numero)
          .subscribe({
            next: () => {
              this.snackBarService.showSuccess('Cuota cobrada con éxito');
              this.dialogRef.close('success');
            },
            error: (err) => {
              this.snackBarService.showError(
                err.error.isUserFriendly
                  ? err.error.message
                  : 'Error al cobrar la cuota'
              );
            },
          });
      } else {
        this.snackBarService.showError('Por favor, complete todos los campos');
      }
    } else {
      this.snackBarService.showError('No se encontró la última cuota');
      this.dialogRef.close('none');
    }
  }

  onCancel() {
    this.dialogRef.close('none');
  }
}

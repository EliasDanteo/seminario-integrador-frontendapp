import { Component, OnInit } from '@angular/core';
import { ActividadesAbogadoService } from '../../../core/services/actividades-abogado.service.js';
import { SnackbarService } from '../../../core/services/snackbar.service.js';
import { IActividadRealizada } from '../../../core/interfaces/IActividad-realizada.interface.js';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-mis-actividades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-actividades.component.html',
  styleUrl: './mis-actividades.component.css',
})
export class MisActividadesComponent implements OnInit {
  actividadesRealizadas: IActividadRealizada[] = [];

  constructor(
    private actividadesAbogadoService: ActividadesAbogadoService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadActividadesAbogado();
  }

  loadActividadesAbogado() {
    this.actividadesAbogadoService.getActividadesAbogado().subscribe({
      next: (response) => {
        this.actividadesRealizadas = response.data;
      },
      error: () => {
        this.snackBarService.showError(
          'Error al cargar las actividades del abogado'
        );
      },
    });
  }

  onUpdate(actividad: IActividadRealizada) {
    console.log('Actualizar actividad:', actividad);
  }

  onDelete(actividad_id: number) {
    console.log('Eliminar actividad:', actividad_id);
  }

  onCreate() {
    console.log('Crear nueva actividad');
  }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbogadosCasoComponent } from './abogados-caso/abogados-caso.component.js';
import { NotasCasoComponent } from './notas-caso/notas-caso-list/notas-caso.component.js';
import { RecordatoriosListComponent } from './recordatorios-caso/recordatorios-list/recordatorios-list.component.js';
import { CommonModule } from '@angular/common';
import { ComentariosListComponent } from './comentarios-caso/comentarios-list/comentarios-list.component.js';
import { ICaso } from '../../../core/interfaces/ICaso.interface.js';
import { ActivatedRoute } from '@angular/router';
import { DocumentosListComponent } from './documentos-caso/documentos-list/documentos-list.component.js';
import { CuotasListComponent } from './cuotas-caso/cuotas-list/cuotas-list.component.js';
import { InformesDialogComponent } from '../../../shared/informes-dialog/informes-dialog.component.js';
import { AuthService } from '../../../core/services/auth.service.js';
import { SnackbarService } from '../../../core/services/snackbar.service.js';
import { IAbogadoCaso } from '../../../core/interfaces/IAbogadoCaso.interface.js';
import { CasosService } from '../../../core/services/casos.service.js';

@Component({
  selector: 'app-casos-information-dialog',
  standalone: true,
  imports: [
    CommonModule,
    AbogadosCasoComponent,
    NotasCasoComponent,
    DocumentosListComponent,
    RecordatoriosListComponent,
    ComentariosListComponent,
    CuotasListComponent,
  ],
  templateUrl: './casos-information-dialog.component.html',
  styleUrl: './casos-information-dialog.component.css',
})
export class CasosInformationDialogComponent {
  caso: ICaso | null = null;
  usuario: any = null;
  selectedSection: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private casosService: CasosService,
    private snackBarService: SnackbarService
  ) {
    this.usuario = this.authService.getUser();
  }

  ngOnInit(): void {
    const casoId = this.route.snapshot.paramMap.get('id');

    if (casoId) {
      this.loadCaso(casoId);
    }
    this.selectedSection = localStorage.getItem('selectedSection') || null;
  }

  loadCaso(casoId: string) {
    this.casosService.getOne(casoId).subscribe({
      next: (response) => {
        this.caso = response.data;
        this.loadAbogadosCaso(this.caso.id);
      },
      error: (err) => {
        if (err.error.isUserFriendly) {
          this.snackBarService.showError(err.error.message);
        } else {
          this.snackBarService.showError(
            'Error cargando los detalles del caso. Por favor, inténtelo de nuevo más tarde.'
          );
        }
      },
    });
  }

  loadAbogadosCaso(casoId: number) {
    this.casosService.getAbogadosEnCaso(casoId).subscribe({
      next: (response) => {
        this.caso!.abogados_activos = response.data.map(
          (abogadoCaso: IAbogadoCaso) => abogadoCaso.abogado
        );
      },
      error: (err) => {
        console.error('Error loading abogados:', err);
      },
    });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('selectedSection');
  }

  showNotas() {
    this.selectedSection = 'notas';
    localStorage.setItem('selectedSection', 'notas');
  }

  showAbogados() {
    this.selectedSection = 'abogados';
    localStorage.setItem('selectedSection', 'abogados');
  }

  showDocumentos() {
    this.selectedSection = 'documentos';
    localStorage.setItem('selectedSection', 'documentos');
  }

  showRecordatorios() {
    this.selectedSection = 'recordatorios';
    localStorage.setItem('selectedSection', 'recordatorios');
  }

  showComentarios() {
    this.selectedSection = 'comentarios';
    localStorage.setItem('selectedSection', 'comentarios');
  }

  showCuotas() {
    this.selectedSection = 'cuotas';
    localStorage.setItem('selectedSection', 'cuotas');
  }

  solicitarInformeCaso(caso: ICaso) {
    this.dialog.open(InformesDialogComponent, {
      data: {
        caso: caso,
        informeType: 'caso',
      },
    });
  }
}

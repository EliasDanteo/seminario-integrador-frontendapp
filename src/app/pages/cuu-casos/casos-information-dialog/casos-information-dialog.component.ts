import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbogadosCasoComponent } from './abogados-caso/abogados-caso.component.js';
import { NotasCasoComponent } from './notas-caso/notas-caso-list/notas-caso.component.js';
import { RecordatoriosListComponent } from './recordatorios-caso/recordatorios-list/recordatorios-list.component.js';
import { CommonModule } from '@angular/common';
import { ComentariosListComponent } from './comentarios-caso/comentarios-list/comentarios-list.component.js';
import { ICaso } from '../../../core/interfaces/ICaso.interface.js';
import { ActivatedRoute, Params } from '@angular/router';
import { DocumentosListComponent } from './documentos-caso/documentos-list/documentos-list.component.js';
import { CuotasListComponent } from './cuotas-caso/cuotas-list/cuotas-list.component.js';
import { InformesDialogComponent } from '../../../shared/informes-dialog/informes-dialog.component.js';
import { AuthService } from '../../../core/services/auth.service.js';
import { SnackbarService } from '../../../core/services/snackbar.service.js';
import { IAbogadoCaso } from '../../../core/interfaces/IAbogadoCaso.interface.js';
import { CasosService } from '../../../core/services/casos.service.js';
import { Subscription } from 'rxjs';

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
export class CasosInformationDialogComponent implements OnInit, OnDestroy {
  caso: ICaso | null = null;
  usuario: any = null;
  selectedSection: string | null = null;
  private routeSub: Subscription = Subscription.EMPTY;

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
    this.routeSub = this.route.params.subscribe((params: Params) => {
      const casoId = params['id'];

      if (casoId) {
        this.selectedSection =
          localStorage.getItem(`selectedSection_${casoId}`) || null;
        this.loadCaso(casoId);
      }
    });
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

  showNotas() {
    this.setSelectedSection('notas');
  }

  showAbogados() {
    this.setSelectedSection('abogados');
  }

  showDocumentos() {
    this.setSelectedSection('documentos');
  }

  showRecordatorios() {
    this.setSelectedSection('recordatorios');
  }

  showComentarios() {
    this.setSelectedSection('comentarios');
  }

  showCuotas() {
    this.setSelectedSection('cuotas');
  }

  private setSelectedSection(section: string) {
    if (!this.caso) return;
    this.selectedSection = section;
    localStorage.setItem(`selectedSection_${this.caso.id}`, section);
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    if (this.caso) {
      localStorage.removeItem(`selectedSection_${this.caso.id}`);
    }
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

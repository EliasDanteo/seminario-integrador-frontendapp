import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AbogadosCasoComponent } from './abogados-caso/abogados-caso.component.js';
import { NotasCasoComponent } from './notas-caso/notas-caso-list/notas-caso.component.js';
import { RecordatoriosListComponent } from './recordatorios-caso/recordatorios-list/recordatorios-list.component.js';
import { ClienteCasoComponent } from './cliente-caso/cliente-caso.component.js';
import { CommonModule } from '@angular/common';
import { ComentariosListComponent } from './comentarios-caso/comentarios-list/comentarios-list.component.js';
import { ICaso } from '../../../core/interfaces/ICaso.interface.js';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.js';
import { RecordatoriosDialogComponent } from './recordatorios-caso/recordatorios-dialog/recordatorios-dialog.component';
import { DocumentosListComponent } from './documentos-caso/documentos-list/documentos-list.component.js';
import { CuotasListComponent } from './cuotas-caso/cuotas-list/cuotas-list.component.js';
import { InformesService } from '../../../core/services/informes.service.js';
import { ComponentType } from '@angular/cdk/portal';
import { InformesDialogComponent } from '../../../shared/informes-dialog/informes-dialog.component.js';

@Component({
  selector: 'app-casos-information-dialog',
  standalone: true,
  imports: [
    CommonModule,
    AbogadosCasoComponent,
    NotasCasoComponent,
    DocumentosListComponent,
    RecordatoriosListComponent,
    ClienteCasoComponent,
    ComentariosListComponent,
    RecordatoriosDialogComponent,
    CuotasListComponent,
  ],
  templateUrl: './casos-information-dialog.component.html',
  styleUrl: './casos-information-dialog.component.css',
})
export class CasosInformationDialogComponent {
  caso: ICaso | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const casoId = this.route.snapshot.paramMap.get('id');

    if (casoId) {
      this.http
        .get<{ message: string; data: ICaso }>(
          `${environment.casosUrl}/${casoId}`
        )
        .subscribe({
          next: (res) => {
            this.caso = res.data;
          },
          error: (err) => {
            console.error('Error al cargar el caso', err);
          },
        });
    }
  }
  loadCaso(id: string): void {
    this.http.get<ICaso>(`${environment.casosUrl}/${id}`).subscribe({
      next: (data) => {
        this.caso = data;
      },
      error: (err) => {
        console.error('Error al cargar el caso', err);
      },
    });
  }

  selectedSection: string | null = null;

  showNotas() {
    this.selectedSection = 'notas';
  }

  showAbogados() {
    this.selectedSection = 'abogados';
  }

  showDocumentos() {
    this.selectedSection = 'documentos';
  }

  showRecordatorios() {
    this.selectedSection = 'recordatorios';
  }

  showComentarios() {
    this.selectedSection = 'comentarios';
  }

  showCuotas() {
    this.selectedSection = 'cuotas';
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

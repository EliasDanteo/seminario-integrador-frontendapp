import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { InformesDialogComponent } from '../../../shared/informes-dialog/informes-dialog.component.js';
import { CasosService } from '../../../core/services/casos.service.js';
import { IAbogadoCaso } from '../../../core/interfaces/IAbogadoCaso.interface.js';
import { AuthService } from '../../../core/services/auth.service.js';

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
  usuario: any = null;
  selectedSection: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.usuario = this.authService.getUser();
  }

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
    this.selectedSection = localStorage.getItem('selectedSection') || null;
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

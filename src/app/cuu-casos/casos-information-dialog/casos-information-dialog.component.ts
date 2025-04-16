import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbogadosCasoComponent } from './abogados-caso/abogados-caso.component.js';
import { NotasCasoComponent } from './notas-caso/notas-caso-list/notas-caso.component.js';
import { DocumentosCasoComponent } from './documentos-caso/documentos-caso.component.js';
import { RecordatoriosListComponent } from './recordatorios-caso/recordatorios-list/recordatorios-list.component.js';
import { ClienteCasoComponent } from './cliente-caso/cliente-caso.component.js';
import { CommonModule } from '@angular/common';
import { ComentariosListComponent } from './comentarios-caso/comentarios-list/comentarios-list.component.js';

@Component({
  selector: 'app-casos-information-dialog',
  standalone: true,
  imports: [
    AbogadosCasoComponent,
    NotasCasoComponent,
    DocumentosCasoComponent,
    ClienteCasoComponent,
    RecordatoriosListComponent,
    ComentariosListComponent,
    CommonModule,
  ],
  templateUrl: './casos-information-dialog.component.html',
  styleUrl: './casos-information-dialog.component.css',
})
export class CasosInformationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  currentComponent: string | null = null;

  showNotas() {
    this.currentComponent = 'notas';
  }

  showAbogados() {
    this.currentComponent = 'abogados';
  }

  showDocumentos() {
    this.currentComponent = 'documentos';
  }

  showCliente() {
    this.currentComponent = 'cliente';
  }

  showRecordatorios() {
    this.currentComponent = 'recordatorios';
  }

  showComentarios() {
    this.currentComponent = 'comentarios';
  }

  limpiar() {
    this.currentComponent = null;
  }
}

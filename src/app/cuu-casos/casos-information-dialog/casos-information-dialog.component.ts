import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbogadosCasoComponent } from './abogados-caso/abogados-caso.component.js';
import { NotasCasoComponent } from './notas-caso/notas-caso-list/notas-caso.component.js';
import { DocumentosCasoComponent } from './documentos-caso/documentos-caso.component.js';
import { ClienteCasoComponent } from './cliente-caso/cliente-caso.component.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-casos-information-dialog',
  standalone: true,
  imports: [
    AbogadosCasoComponent,
    NotasCasoComponent,
    DocumentosCasoComponent,
    ClienteCasoComponent,
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

  limpiar() {
    this.currentComponent = null;
  }
}

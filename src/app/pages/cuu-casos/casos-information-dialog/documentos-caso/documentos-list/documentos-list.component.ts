import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { environment } from '../../../../../../environments/environment.js';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import IDocumentos from '../../../../../core/interfaces/IDocumentos.interface.js';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { DocumentosDialogComponent } from '../documentos-dialog/documentos-dialog.component.js';

@Component({
  selector: 'app-documentos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentos-list.component.html',
  styleUrl: './documentos-list.component.css',
})
export class DocumentosListComponent {
  @Input() caso!: ICaso;
  @ViewChild('fileInput') fileInput!: ElementRef;
  documentos: IDocumentos[] = [];
  documentoParaVer: IDocumentos | null = null;
  selectedFile: File | null = null;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit() {
    if (this.caso) {
      this.loadDocuments();
    }
  }

  loadDocuments() {
    if (this.caso) {
      this.httpClient
        .get<{ message: string; data: IDocumentos[] }>(
          `${environment.documentosUrl}/por-caso/${this.caso.id}`
        )
        .subscribe({
          next: (res) => {
            this.documentos = res.data;
          },
          error: (err) => {
            this.snackBarService.showError('Error al cargar los documentos');
          },
        });
    }
  }

  verDocumento(documento: IDocumentos): void {
    this.httpClient
      .get(`${environment.documentosUrl}/${documento.id}`, {
        responseType: 'blob', // 👈 Muy importante
      })
      .subscribe({
        next: (response) => {
          this.convertirBlob(response);
        },
        error: () =>
          this.snackBarService.showError('Error al cargar el documento'),
      });
  }

  private convertirBlob(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  deleteDocument(documento: IDocumentos) {
    console.log(documento);
    this.httpClient
      .patch<{ message: string; data: IDocumentos }>(
        `${environment.documentosUrl}/deactivate/${documento.id}`,
        {}
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.loadDocuments();
        },
        error: (error) => {
          this.snackBarService.showError(error.error.message);
        },
      });
  }

  uploadDocument() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('archivo', this.selectedFile);
    formData.append('id_caso', this.caso!.id.toString());
    formData.append('nombre', this.selectedFile.name);

    this.httpClient.post(`${environment.documentosUrl}`, formData).subscribe({
      next: () => {
        this.loadDocuments();
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
      },
      error: (err) => {
        console.error('Error:', err);
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
      },
    });
  }
}

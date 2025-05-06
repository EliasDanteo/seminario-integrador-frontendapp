import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { environment } from '../../../../../../environments/environment.js';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import { IDocumentos } from '../../../../../core/interfaces/IDocumentos.interface.js';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DocumentosDialogComponent } from '../documentos-dialog/documentos-dialog.component.js';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../../core/services/auth.service.js';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component.js';

@Component({
  selector: 'app-documentos-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    DocumentosDialogComponent,
  ],
  templateUrl: './documentos-list.component.html',
  styleUrl: './documentos-list.component.css',
})
export class DocumentosListComponent {
  @Input() caso!: ICaso;
  documentos: IDocumentos[] = [];
  documentoParaVer: IDocumentos | null = null;
  usuario: any = null;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.usuario = this.authService.getUser();
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadDocuments();
      }
    });
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
            this.documentos = res.data.map((documento) => ({
              ...documento,
              nombre: this.removeFileExtension(documento.nombre),
            }));
          },
          error: (err) => {
            this.snackBarService.showError(err.error.message);
          },
        });
    }
  }

  private removeFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');

    return lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
  }

  verDocumento(documento: IDocumentos): void {
    this.httpClient
      .get<any>(`${environment.documentosUrl}/${documento.id}`)
      .subscribe({
        next: (res) => {
          const rawData = res.data.archivo.data as number[];
          const bytes = new Uint8Array(rawData);
          const ext = res.data.nombre.split('.').pop()?.toLowerCase();
          let mime = (res.data.mimeType as string) || '';
          if (!mime) {
            if (ext === 'pdf') mime = 'application/pdf';
            else if (ext === 'png') mime = 'image/png';
            else if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg';
            else mime = 'application/octet-stream';
          }

          const blob = new Blob([bytes], { type: mime });
          const url = URL.createObjectURL(blob);

          const forceDownload =
            mime !== 'application/pdf' && !mime.startsWith('image/');

          const a = document.createElement('a');
          a.href = url;
          a.download = documento.nombre.includes('.')
            ? documento.nombre
            : `${documento.nombre}.${ext || 'bin'}`;

          if (forceDownload) {
            a.click();
            URL.revokeObjectURL(url);
          } else {
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 10000);
          }
        },
        error: () =>
          this.snackBarService.showError(
            'Error al cargar el documento aaaaaaa'
          ),
      });
  }

  openDeleteDialog(documento: IDocumentos) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: documento.nombre,
        entidad: 'Documento',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.eliminarDocumento(documento);
      }
    });
  }

  eliminarDocumento(documento: IDocumentos): void {
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

  openCreateDialog(): void {
    this.openDialog(DocumentosDialogComponent, {
      caso: this.caso,
    });
  }

  validarPermisos() {
    return this.caso.abogados_activos.some(
      (abogado) => abogado.id === this.usuario.id
    );
  }
}

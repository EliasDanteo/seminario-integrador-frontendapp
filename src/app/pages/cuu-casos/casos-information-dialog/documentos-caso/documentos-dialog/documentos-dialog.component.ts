import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { environment } from '../../../../../../environments/environment.js';

@Component({
  selector: 'app-documentos-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentos-dialog.component.html',
  styleUrls: ['./documentos-dialog.component.css'],
})
export class DocumentosDialogComponent implements OnInit, OnDestroy {
  loading = true;
  error = false;
  errorMessage = '';
  safeUrl!: SafeResourceUrl;
  isPdf = false;
  isImage = false;
  private blobUrl!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number; nombre: string },
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadDocument();
  }

  ngOnDestroy(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }

  private loadDocument(): void {
    this.httpClient
      .get<any>(`${environment.documentosUrl}/${this.data.id}`)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.convertirBlob(response);
        },

        error: (err) =>
          this.snackBarService.showError('Error al cargar el documento'),
      });
  }

  private convertirBlob(response: any): void {
    const byteArray = new Uint8Array(response.data.archivo.data);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  }
}

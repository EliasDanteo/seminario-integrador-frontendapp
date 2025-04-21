import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { environment } from '../../../../../../environments/environment.js';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-documentos-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './documentos-dialog.component.html',
  styleUrls: ['./documentos-dialog.component.css'],
})
export class DocumentosDialogComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  documentoForm: FormGroup;
  uploading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { caso: ICaso },
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<DocumentosDialogComponent>
  ) {
    this.documentoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      archivo: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    if (!this.data.caso) {
      this.snackBarService.showError('No se ha seleccionado un caso');
      this.dialogRef.close('none');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.documentoForm.patchValue({ archivo: file });
    }
  }

  uploadDocument() {
    if (this.documentoForm.invalid || !this.selectedFile) return;
    const formData = new FormData();
    const extension = this.selectedFile.name.split('.').pop() || '';
    const fileName = `${this.documentoForm.value.nombre}.${extension}`;
    formData.append('nombre', fileName);
    formData.append('id_caso', this.data.caso.id.toString());
    formData.append('archivo', this.selectedFile);

    this.uploading = true;

    this.httpClient.post(`${environment.documentosUrl}`, formData).subscribe({
      next: () => {
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
        this.dialogRef.close('success');
        this.snackBarService.showSuccess('Archivo subido correctamente');
      },
      error: (err) => {
        console.error('Error:', err);
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
        this.dialogRef.close('error');
        this.snackBarService.showError('Algo salio mal!');
      },
    });
  }
}

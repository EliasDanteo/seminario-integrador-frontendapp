import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IComentario } from '../../../../../core/interfaces/IComentario.interface.js';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../environments/environment.js';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import { AuthService } from '../../../../../core/services/auth.service.js';

@Component({
  selector: 'app-comentarios-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDividerModule,
    FormsModule,
  ],
  templateUrl: './comentarios-dialog.component.html',
  styleUrl: './comentarios-dialog.component.css',
})
export class ComentariosDialogComponent implements OnInit {
  comentarioForm: FormGroup;
  isReply: boolean = false;
  today: Date;
  usuario: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: string;
      comentario: IComentario | null;
      caso: ICaso;
    },
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<ComentariosDialogComponent>,
    private authService: AuthService
  ) {
    this.usuario = this.authService.getUser();
    this.comentarioForm = new FormGroup({
      comentario: new FormControl('', Validators.required),
    });
    this.today = new Date();
  }

  ngOnInit(): void {
    if (this.data.action === 'reply') {
      this.isReply = true;
    }
  }

  deleteComentario(comentario: IComentario): void {
    this.httpClient
      .delete<{ message: string; data: IComentario }>(
        `${environment.casosUrl}/comentarios/${comentario.id}`
      )
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.dialogRef.close({ action: 'delete', data: comentario });
        },
        error: (error) => {
          this.snackBarService.showError(
            error.error.isUserFriendly
              ? error.error.message
              : 'Error al eliminar el comentario.'
          );
          this.dialogRef.close('none');
        },
      });
  }

  addComentario(): void {
    let url: string;
    if (this.isReply) {
      url = `${environment.casosUrl}/comentarios/${this.data.comentario?.id}`;
    } else {
      url = `${environment.casosUrl}/comentarios/`;
    }
    const formData = {
      comentario: this.comentarioForm.value.comentario,
      id_caso: this.data.caso.id,
      id_abogado: this.usuario.id,
    };
    this.httpClient
      .post<{ message: string; data: IComentario }>(url, formData)
      .subscribe({
        next: (response) => {
          this.snackBarService.showSuccess(response.message);
          this.dialogRef.close({
            action: this.data.action,
            data: response.data,
          });
        },
        error: (error) => {
          this.snackBarService.showError(
            error.error.isUserFriendly
              ? error.error.message
              : 'Error al agregar el comentario.'
          );
          this.dialogRef.close('none');
        },
      });
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}

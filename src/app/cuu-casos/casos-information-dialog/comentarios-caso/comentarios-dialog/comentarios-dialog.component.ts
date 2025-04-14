import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IComentario } from '../../../../core/interfaces/IComentario.interface.js';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../../services/snackbar.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comentarios-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comentarios-dialog.component.html',
  styleUrl: './comentarios-dialog.component.css',
})
export class ComentariosDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: string;
      comentario: IComentario | null;
      casoId: number;
    },
    private httpClient: HttpClient,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // Initialization logic here
  }
}

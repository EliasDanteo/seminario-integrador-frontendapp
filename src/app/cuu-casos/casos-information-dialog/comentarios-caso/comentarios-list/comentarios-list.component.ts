import { Component, Input, OnInit } from '@angular/core';
import { ICaso } from '../../../../core/interfaces/ICaso.interface.js';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../../services/snackbar.service.js';
import { environment } from '../../../../../environments/environment.js';
import { IComentario } from '../../../../core/interfaces/IComentario.interface.js';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { ComentariosDialogComponent } from '../comentarios-dialog/comentarios-dialog.component.js';
import { ComentariosUnidadComponent } from '../comentarios-unidad/comentarios-unidad.component.js';

@Component({
  selector: 'app-comentarios-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    CommonModule,
    ComentariosUnidadComponent,
  ],
  templateUrl: './comentarios-list.component.html',
  styleUrl: './comentarios-list.component.css',
})
export class ComentariosListComponent implements OnInit {
  comentariosCaso: IComentario[] = [];

  @Input() caso!: ICaso;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadComentarios();
      }
    });
  }

  ngOnInit(): void {
    this.loadComentarios();
  }

  loadComentarios() {
    this.httpClient
      .get<{ message: string; data: IComentario[] }>(
        `${environment.casosUrl}/comentarios/${this.caso.id}`
      )
      .subscribe({
        next: (response) => {
          this.comentariosCaso = response.data.filter((comentario) => {
            return comentario.padre === null;
          });
        },
        error: () => {
          this.snackBarService.showError('Error al cargar los comentarios');
        },
      });
  }

  openCreateDialog(action: string, comentarioPadre?: IComentario) {
    const data = {
      action: action,
      comentario: comentarioPadre,
      caso: this.caso,
    };
    this.openDialog(ComentariosDialogComponent, data);
  }

  openDeleteDialog(comentario: IComentario) {
    const data = {
      action: 'delete',
      comentario: comentario,
      caso: this.caso,
    };
    this.openDialog(ComentariosDialogComponent, data);
  }

  toggleRespuestas(comentario: IComentario): void {
    comentario.mostrarRespuestas = !comentario.mostrarRespuestas;
  }
}

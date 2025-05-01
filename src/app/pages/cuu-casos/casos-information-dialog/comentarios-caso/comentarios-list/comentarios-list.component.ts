import { Component, Input, OnInit } from '@angular/core';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { environment } from '../../../../../../environments/environment.js';
import { IComentario } from '../../../../../core/interfaces/IComentario.interface.js';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ComentariosDialogComponent } from '../comentarios-dialog/comentarios-dialog.component.js';
import { ComentariosUnidadComponent } from '../comentarios-unidad/comentarios-unidad.component.js';
import { AuthService } from '../../../../../core/services/auth.service.js';

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
  @Input() caso!: ICaso;
  comentariosCaso: IComentario[] = [];
  usuario: any = null;

  constructor(
    private http: HttpClient,
    private snack: SnackbarService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.usuario = this.authService.getUser();
  }

  ngOnInit(): void {
    this.loadComentarios();
  }

  private loadComentarios(): void {
    this.http
      .get<{ message: string; data: IComentario[] }>(
        `${environment.casosUrl}/comentarios/${this.caso.id}`
      )
      .subscribe({
        next: (response) => {
          this.comentariosCaso = this.marcarEliminables(response.data);
        },
        error: (err) => this.snack.showError(err.error.message),
      });
  }

  openCreateDialog(action: 'create' | 'reply', parent?: IComentario): void {
    const dialogRef = this.dialog.open(ComentariosDialogComponent, {
      data: { action, comentario: parent, caso: this.caso },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (!res) return;

      switch (res.action) {
        case 'create':
          this.addCommentLocally(res.data);
          break;
        case 'reply':
          this.addReplyLocally(res.data, parent!);
          break;
        case 'delete':
          this.removeCommentLocally(res.data);
          break;
      }
    });
  }

  private addCommentLocally(newComment: IComentario) {
    this.comentariosCaso.push({
      ...newComment,
      respuestas: [],
      mostrarRespuestas: true,
      sePuedeEliminar: true,
      fecha_hora: new Date(),
    });
  }

  private addReplyLocally(reply: IComentario, parent: IComentario) {
    if (!parent.respuestas) parent.respuestas = [];
    parent.respuestas.push({
      ...reply,
      respuestas: [],
      mostrarRespuestas: true,
      sePuedeEliminar: true,
      fecha_hora: new Date(),
    });
    parent.mostrarRespuestas = true;
  }

  private removeCommentLocally(toDelete: IComentario) {
    const eliminarEn = (arr: IComentario[]): boolean => {
      const idx = arr.findIndex((c) => c.id === toDelete.id);
      if (idx >= 0) {
        arr.splice(idx, 1);
        return true;
      }
      for (const c of arr) {
        if (c.respuestas && eliminarEn(c.respuestas)) {
          return true;
        }
      }
      return false;
    };
    eliminarEn(this.comentariosCaso);
  }

  openDeleteDialog(comentario: IComentario): void {
    const dialogRef = this.dialog.open(ComentariosDialogComponent, {
      data: { action: 'delete', comentario, caso: this.caso },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res?.action === 'delete') {
        this.removeCommentLocally(res.data);
      }
    });
  }

  private marcarEliminables(comentarios: IComentario[]): IComentario[] {
    const ahora = new Date();

    return comentarios.map((comentario) => {
      const fechaComentario = new Date(comentario.fecha_hora);
      const diferenciaHoras =
        (ahora.getTime() - fechaComentario.getTime()) / (1000 * 60 * 60);

      comentario.sePuedeEliminar = diferenciaHoras < 24;

      if (comentario.respuestas?.length) {
        comentario.respuestas = this.marcarEliminables(comentario.respuestas);
      }

      return comentario;
    });
  }
}

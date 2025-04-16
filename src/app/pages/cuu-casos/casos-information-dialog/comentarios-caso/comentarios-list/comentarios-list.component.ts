import { Component, Input, OnInit } from '@angular/core';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../../../../../core/services/snackbar.service.js';
import { environment } from '../../../../../../environments/environment.js';
import { IComentario } from '../../../../../core/interfaces/IComentario.interface.js';
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
  responseComentarios: IComentario[] = [];
  comentariosCaso: IComentario[] = [];
  private expansionStates = new Map<number, boolean>();

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

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'none') return;

      if (result?.action) {
        switch (result.action) {
          case 'delete':
            this.removeCommentLocally(result.data);
            break;
          default:
            this.loadComentarios();
        }
      } else if (result) {
        this.addCommentLocally(result);
      } else {
        this.loadComentarios();
      }
    });
  }

  ngOnInit(): void {
    this.loadComentarios();
  }

  addCommentLocally(newComment: IComentario): void {
    this.preserveExpansionStates();

    this.responseComentarios.push(newComment);
    this.comentariosCaso = this.buildCommentTree(this.responseComentarios);

    if (newComment.padre?.id) {
      this.expansionStates.set(newComment.padre.id, true);
    }
  }

  private removeCommentLocally(deletedComment: IComentario): void {
    this.preserveExpansionStates();

    this.responseComentarios = this.responseComentarios.filter(
      (c) => c.id !== deletedComment.id
    );
    this.comentariosCaso = this.buildCommentTree(this.responseComentarios);
  }

  private preserveExpansionStates(): void {
    this.expansionStates = new Map();
    this.comentariosCaso.forEach((comment) => {
      this.traverseComments(comment);
    });
  }

  private traverseComments(comment: IComentario): void {
    this.expansionStates.set(comment.id, comment.mostrarRespuestas || false);
    comment.respuestas?.forEach((child) => this.traverseComments(child));
  }

  private buildCommentTree(comments: IComentario[]): IComentario[] {
    const commentMap = new Map<number, IComentario>();
    const rootComments: IComentario[] = [];

    comments.forEach((comment) => {
      commentMap.set(comment.id, {
        ...comment,
        respuestas: [],
        mostrarRespuestas: this.expansionStates.get(comment.id) || false,
      });
    });

    comments.forEach((comment) => {
      const currentComment = commentMap.get(comment.id)!;
      if (comment.padre?.id) {
        const parent = commentMap.get(comment.padre.id);
        parent?.respuestas?.push(currentComment);
      } else {
        rootComments.push(currentComment);
      }
    });

    return rootComments;
  }

  loadComentarios() {
    this.httpClient
      .get<{ message: string; data: IComentario[] }>(
        `${environment.casosUrl}/comentarios/${this.caso.id}`
      )
      .subscribe({
        next: (response) => {
          this.responseComentarios = response.data;
          this.comentariosCaso = this.buildCommentTree(
            this.responseComentarios
          );
        },
        error: () => {
          this.snackBarService.showError('Error al cargar los comentarios');
        },
      });
  }

  openCreateDialog(action: string, parentComment?: IComentario): void {
    this.openDialog(ComentariosDialogComponent, {
      action: action,
      comentario: parentComment,
      caso: this.caso,
    });

    if (action === 'reply' && parentComment) {
      parentComment.mostrarRespuestas = true;
    }
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

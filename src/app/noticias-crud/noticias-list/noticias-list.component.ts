import { Component } from '@angular/core';
import { INoticia } from '../../core/interfaces/INoticia.interface.js';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { environment } from '../../../environments/environment.js';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component.js';
import { NoticiaCrudDialogComponent } from '../../shared/noticia-crud-dialog/noticia-crud-dialog.component.js';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BottomSheetService } from '../../services/bottom-sheet.service.js';
import { SnackbarService } from '../../services/snackbar.service.js';

@Component({
  selector: 'app-noticias-list',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './noticias-list.component.html',
  styleUrl: './noticias-list.component.css',
})
export class NoticiasListComponent {
  noticias: INoticia[] | null = null;
  filteredNoticias: INoticia[] | null = null;
  fullTitleFilter: string = '';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private bottomSheetService: BottomSheetService,
    private snackBarService: SnackbarService
  ) {
    this.loadNoticias();
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadNoticias();
      }
    });
  }

  applyFilters(): void {
    this.filteredNoticias = this.noticias ? [...this.noticias] : [];

    if (this.fullTitleFilter) {
      const filterText = this.normalizeText(this.fullTitleFilter);

      this.filteredNoticias = this.filteredNoticias.filter((noticia) => {
        const fullTitle = this.normalizeText(noticia.titulo);

        return fullTitle.includes(filterText);
      });
    }
  }
  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  loadNoticias() {
    this.http
      .get<{ message: string; data: INoticia[] }>(environment.noticiasUrl)
      .subscribe({
        next: (res) => {
          this.noticias = res.data;
          this.applyFilters();
        },
      });
  }

  openCreateDialog(): void {
    this.openDialog(NoticiaCrudDialogComponent, {
      action: 'post',
      entityType: 'noticia',
      entity: null,
    });
  }

  openEditDialog(noticia: INoticia): void {
    if (noticia) {
      this.openDialog(NoticiaCrudDialogComponent, {
        action: 'put',
        entityType: 'noticia',
        entity: noticia,
      });
    } else {
      console.error('Noticia no disponible');
    }
  }

  openNewsDetails(noticia: INoticia): void {
    this.bottomSheetService.open({
      title: 'Noticia',
      fields: [
        { label: 'Título', key: 'titulo' },
        { label: 'Cuerpo', key: 'cuerpo', type: 'textarea' },
        { label: 'Publicación', key: 'fecha_publicacion' },
        { label: 'Vencimiento', key: 'fecha_vencimiento' },
      ],
      data: noticia,
    });
  }

  deleteNoticiaDialog(noticia: INoticia): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        nombreCompleto: noticia.titulo,
        entidad: 'noticia',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarNoticia(noticia);
      }
    });
  }

  eliminarNoticia(noticia: INoticia): void {
    this.http
      .patch(`${environment.noticiasUrl}/deactivate/${noticia.id}`, {})
      .subscribe({
        next: (response) => {
          this.loadNoticias();
        },
        error: (err) => {
          console.error('Error al dar de baja la noticia', err);
          this.snackBarService.showError(
            'Error al dar de baja la noticia, intente nuevamente'
          );
        },
      });
  }
}

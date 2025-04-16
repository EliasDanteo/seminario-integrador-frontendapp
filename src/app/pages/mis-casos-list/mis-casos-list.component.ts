import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../core/services/snackbar.service.js';
import { ICaso } from '../../core/interfaces/ICaso.interface.js';
import { environment } from '../../../environments/environment.js';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component.js';

@Component({
  selector: 'app-mis-casos-list',
  standalone: true,
  imports: [],
  templateUrl: './mis-casos-list.component.html',
  styleUrl: './mis-casos-list.component.css',
})
export class MisCasosListComponent implements OnInit {
  casos_usuario: ICaso[] = [];

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadCasosUsuario();
  }

  loadCasosUsuario(): void {
    this.httpClient
      .get<{ message: string; data: ICaso[] }>(environment.casosUrl)
      .subscribe({
        next: (response) => {
          this.casos_usuario = response.data;
          console.log(this.casos_usuario);
        },
        error: () => {
          this.snackBarService.showError('Error al cargar los casos');
        },
      });
  }

  openDialog(dialog: ComponentType<unknown>, data: Object): void {
    this.dialog.open(dialog, { data: data });
  }

  openFeedbackDialog(id_caso: number): void {
    this.openDialog(FeedbackDialogComponent, { id_caso });
  }
}

import { Component } from '@angular/core';
import { ICaso } from '../../../core/interfaces/ICaso.interface.js';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { environment } from '../../../../environments/environment.js';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CasosCrudDialogComponent } from '../casos-crud-dialog/casos-crud-dialog.component.js';
import { InformesDialogComponent } from '../../../shared/informes-dialog/informes-dialog.component.js';
import { AuthService } from '../../../core/services/auth.service.js';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../../core/interfaces/IApiResponse.interface.js';
import { FeedbackDialogComponent } from '../../feedback-dialog/feedback-dialog.component.js';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component.js';
import { CasosService } from '../../../core/services/casos.service.js';
import { SnackbarService } from '../../../core/services/snackbar.service.js';
@Component({
  selector: 'app-casos-list',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './casos-list.component.html',
  styleUrl: './casos-list.component.css',
})
export class CasosListComponent {
  casos: ICaso[] | null = null;
  filteredCasos: ICaso[] | null = null;
  clienteFilter: string = '';
  estadoFilter: string = '';
  especialidadFilter: string = '';
  descripcionFilter: string = '';
  usuario: any = null;
  is_admin: boolean = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private casoService: CasosService,
    private snackBarService: SnackbarService
  ) {
    this.usuario = this.authService.getUser();
    authService.getUser()?.is_admin
      ? (this.is_admin = true)
      : (this.is_admin = false);

    if (this.is_admin) {
      this.loadCasosTotales();
    } else {
      this.loadCasosNoAdmin(this.usuario!.id);
    }
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, { data });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.is_admin
          ? this.loadCasosTotales()
          : this.loadCasosNoAdmin(this.usuario!.id);
      }
    });
  }

  showDetails(caso: ICaso): void {
    this.router.navigate(['/casos', caso.id]);
  }

  applyFilters(): void {
    this.filteredCasos = this.casos ? [...this.casos] : [];
    if (this.clienteFilter) {
      const filterText = this.normalizeText(this.clienteFilter);
      this.filteredCasos = this.filteredCasos.filter((caso) => {
        const fullName = this.normalizeText(
          `${caso.cliente.apellido} ${caso.cliente.nombre}`
        );
        return fullName.includes(filterText);
      });
    }
    if (this.estadoFilter) {
      const filterText = this.estadoFilter.trim().toLowerCase();
      this.filteredCasos = this.filteredCasos.filter(
        (caso) => caso.estado.trim().toLowerCase() === filterText
      );
    }
    if (this.especialidadFilter) {
      const filterText = this.especialidadFilter.trim().toLowerCase();
      this.filteredCasos = this.filteredCasos.filter(
        (caso) => caso.especialidad.nombre.trim().toLowerCase() === filterText
      );
    }
    if (this.descripcionFilter) {
      const filterText = this.normalizeText(this.descripcionFilter);
      this.filteredCasos = this.filteredCasos.filter((caso) =>
        this.normalizeText(caso.descripcion).includes(filterText)
      );
    }
  }

  normalizeText(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  loadCasosTotales() {
    this.http.get<ApiResponse<ICaso[]>>(environment.casosUrl).subscribe({
      next: (res) => {
        this.casos = res.data;
        this.applyFilters();
      },
    });
  }

  loadCasosNoAdmin(id: string) {
    if (this.usuario.tipo_usuario === 'abogado') {
      this.http
        .get<ApiResponse<ICaso[]>>(`${environment.casosUrl}/encurso/`)
        .subscribe({
          next: (res) => {
            this.casos = res.data;
            this.applyFilters();
          },
        });
    } else if (this.usuario.tipo_usuario === 'cliente') {
      this.http
        .get<{ message: string; data: ICaso[] }>(
          `${environment.casosUrl}/cliente/${id}`
        )
        .subscribe({
          next: (res) => {
            this.casos = res.data;
            this.applyFilters();
          },
        });
    }
  }

  openCreateDialog(): void {
    this.openDialog(CasosCrudDialogComponent, {
      action: 'post',
      caso: null,
    });
  }

  openEditDialog(caso: ICaso): void {
    if (caso) {
      this.openDialog(CasosCrudDialogComponent, {
        action: 'put',
        caso: caso,
      });
    }
  }

  openEndDialog(caso: ICaso): void {
    if (caso) {
      this.openDialog(CasosCrudDialogComponent, {
        action: 'end',
        caso: caso,
      });
    }
  }

  openDeleteDialog(caso: ICaso): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        nombreCompleto: caso.descripcion,
        entidad: 'caso',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.casoService.delete(caso.id).subscribe({
          next: (response) => {
            if (this.is_admin) {
              this.loadCasosTotales();
            } else {
              this.loadCasosNoAdmin(this.usuario!.id);
            }
          },
          error: (err) => {
            if (err.error.isUserFriendly) {
              this.snackBarService.showError(err.error.message);
            } else
              this.snackBarService.showError('Error al eliminar la actividad');
          },
        });
      }
    });
  }

  openInformeIngresosDialog(): void {
    this.openDialog(InformesDialogComponent, {
      informeType: 'ingresos',
      caso: null,
    });
  }

  openFeedbackDialog(id_caso: number): void {
    this.openDialog(FeedbackDialogComponent, { id_caso });
  }

  validarAdminPrincipal(caso: ICaso): boolean {
    if (this.is_admin || this.usuario?.id === caso.abogado_principal.id) {
      return true;
    }
    return false;
  }

  solicitarInformeCaso(caso: ICaso) {
    this.dialog.open(InformesDialogComponent, {
      data: {
        caso: caso,
        informeType: 'caso',
      },
    });
  }
}

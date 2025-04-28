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
@Component({
  selector: 'app-casos-list',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
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
    private authService: AuthService
  ) {
    console.log('hOLAAAAAAA', authService.getUser());
    this.usuario = authService.getUser();
    this.is_admin = this.usuario?.is_admin;

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
        this.loadCasosTotales();
      }
    });
  }

  showDetails(caso: ICaso): void {
    // Navegar a la ruta de detalle de caso y pasar los datos necesarios
    this.router.navigate(['/casos', caso.id]);
  }

  /*
  verCliente(cliente: any): void {
    alert(`Ver información del cliente: ${cliente.apellido} ${cliente.nombre}`);
  }
  */

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
    this.http
      .get<{ message: string; data: ICaso[] }>(environment.casosUrl)
      .subscribe({
        next: (res) => {
          this.casos = res.data;
          this.applyFilters();
        },
      });
  }

  loadCasosNoAdmin(id: string) {
    this.http
      .get<{ message: string; data: ICaso[] }>(
        `${environment.casosUrl}/${id}/usuario`
      )
      .subscribe({
        next: (res) => {
          this.casos = res.data;
          this.applyFilters();
        },
      });
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
    if (caso) {
      this.openDialog(CasosCrudDialogComponent, {
        action: 'delete',
        caso: caso,
      });
    }
  }

  openInformeIngresosDialog(): void {
    this.openDialog(InformesDialogComponent, {
      informeType: 'ingresos',
      caso: null,
    });
  }
}

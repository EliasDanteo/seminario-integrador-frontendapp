import { Component } from '@angular/core';
import IAbogado from '../../core/interfaces/IAbogado.interface.js';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.js';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { AbogadosDialogComponent } from '../abogados-dialog/abogados-dialog.component.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-abogados-list',
  standalone: true,
  imports: [HttpClientModule, MatButtonModule, FormsModule],
  templateUrl: './abogados-list.component.html',
  styleUrl: './abogados-list.component.css',
})
export class AbogadosListComponent {
  abogados: IAbogado[] | null = null;

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.loadAbogados();
  }
  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
        this.loadAbogados();
      }
    });
  }

  loadAbogados() {
    this.http
      .get<{ message: string; data: IAbogado[] }>(environment.abogadosUrl)
      .subscribe({
        next: (res) => {
          this.abogados = res.data;
        },
      });
  }

  openCreateDialog(): void {
    this.openDialog(AbogadosDialogComponent, {
      action: 'post',
    });
  }

  openEditDialog(abogado: IAbogado): void {
    this.openDialog(AbogadosDialogComponent, {
      action: 'put',
      abogado,
    });
  }
}

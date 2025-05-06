import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service.js';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from './edit-profile/edit-profile.component.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  user: any = null;
  showContent = false;
  service: any = null;
  fotoAbogadoUrl: string | null = null;

  constructor(private authService: AuthService, private dialog: MatDialog) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    const aux = this.user?.foto;
    if (aux)
      if (aux.type === 'Buffer' && aux.data) {
        const uint8Array = new Uint8Array(aux.data);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });

        this.fotoAbogadoUrl = URL.createObjectURL(blob);
      }
    setTimeout(() => (this.showContent = true), 100);
  }

  get userType(): string {
    if (!this.user) return '';
    return this.user.tipo_usuario || 'usuario';
  }

  openDialog(dialog: ComponentType<unknown>, data: object): void {
    const dialogRef = this.dialog.open(dialog, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'none') {
      }
    });
  }

  openEditProfileDialog(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '600px',
      data: {
        user: this.user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'none') {
        this.user = result;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service.js';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from './edit-profile/edit-profile.component.js';
import { AbogadoService } from '../../core/services/abogados.service.js';
import { SecreatarioService } from '../../core/services/secretario.service.js';
import { ClienteService } from '../../core/services/cliente.service.js';
import { TipoUsuarioEnum } from '../../core/utils/enums.js';

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

  constructor(private authService: AuthService, private dialog: MatDialog) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    setTimeout(() => (this.showContent = true), 100);
  }

  get userType(): string {
    if (!this.user) return '';
    return this.user.tipo_usuario || 'usuario';
  }

  get userPhoto(): string | null {
    if (!this.user?.foto) return null;

    if (this.user.foto.type === 'Buffer' && this.user.foto.data) {
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(this.user.foto.data))
      );
      return `data:image/jpeg;base64,${base64String}`;
    }

    return null;
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
        this.user = this.authService.getUser();
      }
    });
  }
}

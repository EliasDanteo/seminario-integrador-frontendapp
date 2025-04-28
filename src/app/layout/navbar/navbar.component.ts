import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service.js';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TipoUsuarioEnum } from '../../core/utils/enums.js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatMenuModule, CommonModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  public userSignal: any;
  public user: any;

  constructor(private router: Router, public authService: AuthService) {
    this.userSignal = this.authService.userSignal;

    this.user = this.authService.getUser();

    if (this.userSignal() === null) {
      this.router.navigate(['/']);
    }
  }

  async logout() {
    if (await this.authService.logout()) this.router.navigate(['/']);
  }
  esAbogado(): boolean {
    return this.user?.tipo_usuario === TipoUsuarioEnum.ABOGADO;
  }

  esSecretario(): boolean {
    return this.user?.tipo_usuario === TipoUsuarioEnum.SECRETARIO;
  }

  esCliente(): boolean {
    return this.user?.tipo_usuario === TipoUsuarioEnum.CLIENTE;
  }

  esAdmin(): boolean {
    return this.user?.is_admin; // Porque el admin te llega como booleano aparte
  }
}

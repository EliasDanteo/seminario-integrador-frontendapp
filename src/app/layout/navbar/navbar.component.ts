import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service.js';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TipoUsuarioEnum } from '../../core/utils/enums.js';
import { BehaviorSubject } from 'rxjs';
import { ICliente } from '../../core/interfaces/ICliente.interface.js';
import { IAbogado } from '../../core/interfaces/IAbogado.interface.js';
import { ISecretario } from '../../core/interfaces/ISecretario.interface.js';

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
  public isLoggedIn: boolean = false;
  public currentUser: any = null;

  constructor(private router: Router, public authService: AuthService) {
    this.userSignal = this.authService.userSignal;
    this.authService.isAuthenticated$.subscribe((authStatus) => {
      this.isLoggedIn = authStatus;
      if (authStatus) {
        this.currentUser = this.authService.getUser();
      } else {
        this.currentUser = null;
      }
    });

    effect(() => {
      this.currentUser = this.authService.getUser();
    });
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((authStatus) => {
      this.isLoggedIn = authStatus;
    });
  }

  async logout() {
    if (await this.authService.logout()) this.router.navigate(['/']);
  }
  esAbogado(): boolean {
    return this.currentUser?.tipo_usuario === TipoUsuarioEnum.ABOGADO;
  }

  esSecretario(): boolean {
    return this.currentUser?.tipo_usuario === TipoUsuarioEnum.SECRETARIO;
  }

  esCliente(): boolean {
    return this.currentUser?.tipo_usuario === TipoUsuarioEnum.CLIENTE;
  }

  esAdmin(): boolean {
    return this.currentUser?.is_admin;
  }
}

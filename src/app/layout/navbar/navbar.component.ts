import { Component, effect, HostListener } from '@angular/core';
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
  public isLoggedIn: boolean = false;
  public currentUser: any = null;
  public mobileMenuOpen: boolean = false;

  constructor(private router: Router, public authService: AuthService) {
    this.userSignal = this.authService.userSignal;
    this.authService.isAuthenticated$.subscribe((authStatus) => {
      this.isLoggedIn = authStatus;
      this.currentUser = authStatus ? this.authService.getUser() : null;
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar') && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  async logout() {
    if (await this.authService.logout()) {
      this.closeMobileMenu();
      this.router.navigate(['/']);
    }
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

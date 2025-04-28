import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service.js';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatMenuModule, CommonModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  public userSignal: any;

  constructor(private router: Router, public authService: AuthService) {
    this.userSignal = this.authService.userSignal;
    this.authService.getUser();
    if (this.userSignal() === null) {
      this.router.navigate(['/']);
    }
  }

  async logout() {
    if (await this.authService.logout()) this.router.navigate(['/']);
  }
}

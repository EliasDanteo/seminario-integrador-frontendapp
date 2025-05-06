import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component.js';
import { MatDialog } from '@angular/material/dialog';
import { MensajeDialogComponent } from './shared/mensaje-dialog/mensaje-dialog.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['mensaje']) {
        this.dialog.open(MensajeDialogComponent, {
          data: { mensaje: params['mensaje'] },
        });
      }
    });
  }
}

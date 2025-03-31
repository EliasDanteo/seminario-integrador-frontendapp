import { Component, Input } from '@angular/core';
import { ICliente } from '../../../core/interfaces/ICliente.interface.js';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cliente-caso',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './cliente-caso.component.html',
  styleUrl: './cliente-caso.component.css',
})
export class ClienteCasoComponent {
  @Input() cliente!: ICliente;
}

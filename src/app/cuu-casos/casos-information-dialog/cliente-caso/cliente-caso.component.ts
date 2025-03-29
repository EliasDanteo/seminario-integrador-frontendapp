import { Component, Input } from '@angular/core';
import { ICliente } from '../../../core/interfaces/ICliente.interface.js';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-caso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-caso.component.html',
  styleUrl: './cliente-caso.component.css',
})
export class ClienteCasoComponent {
  @Input() cliente!: ICliente;
}

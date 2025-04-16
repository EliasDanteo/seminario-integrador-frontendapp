import { Component, Input } from '@angular/core';
import { ICaso } from '../../../../core/interfaces/ICaso.interface.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalles-caso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalles-caso.component.html',
  styleUrl: './detalles-caso.component.css',
})
export class DetallesCasoComponent {
  @Input() caso!: ICaso;
}

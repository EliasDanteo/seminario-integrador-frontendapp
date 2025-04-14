import { Component, Input } from '@angular/core';
import { ICaso } from '../../../../core/interfaces/ICaso.interface.js';

@Component({
  selector: 'app-comentarios-list',
  standalone: true,
  imports: [],
  templateUrl: './comentarios-list.component.html',
  styleUrl: './comentarios-list.component.css',
})
export class ComentariosListComponent {
  @Input() caso!: ICaso;
}

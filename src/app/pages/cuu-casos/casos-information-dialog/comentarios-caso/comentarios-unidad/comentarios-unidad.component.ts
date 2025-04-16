import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IComentario } from '../../../../../core/interfaces/IComentario.interface.js';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comentarios-unidad',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatButtonModule, CommonModule],
  templateUrl: './comentarios-unidad.component.html',
  styleUrl: './comentarios-unidad.component.css',
})
export class ComentariosUnidadComponent {
  @Input() comentario!: IComentario;
  @Input() nivel!: number;
  @Input() casoEstado!: string;
  @Output() delete = new EventEmitter<IComentario>();
  @Output() reply = new EventEmitter<IComentario>();

  toggleRespuestas(): void {
    this.comentario.mostrarRespuestas = !this.comentario.mostrarRespuestas;
  }

  onDelete(): void {
    this.delete.emit(this.comentario);
  }

  onReply(): void {
    this.reply.emit(this.comentario);
  }

  get marginLeft(): string {
    return `${this.nivel * 30}px`;
  }
}

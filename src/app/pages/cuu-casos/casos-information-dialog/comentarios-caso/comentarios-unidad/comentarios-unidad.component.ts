import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IComentario } from '../../../../../core/interfaces/IComentario.interface.js';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service.js';
import { ICaso } from '../../../../../core/interfaces/ICaso.interface.js';

@Component({
  selector: 'app-comentarios-unidad',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatButtonModule, CommonModule],
  templateUrl: './comentarios-unidad.component.html',
  styleUrl: './comentarios-unidad.component.css',
})
export class ComentariosUnidadComponent {
  @Input() comentario!: IComentario;
  @Input() nivel: number = 0;
  @Input() caso!: ICaso;
  @Output() delete = new EventEmitter<IComentario>();
  @Output() reply = new EventEmitter<IComentario>();
  usuario: any;

  constructor(private authService: AuthService) {
    this.usuario = this.authService.getUser();
  }

  toggleRespuestas(): void {
    this.comentario.mostrarRespuestas = !this.comentario.mostrarRespuestas;
  }

  onDelete(): void {
    this.delete.emit(this.comentario);
  }

  onReply(): void {
    this.reply.emit(this.comentario);
  }

  validarPermisos() {
    return this.caso.abogados_activos.some(
      (abogado) => abogado.id === this.usuario.id
    );
  }
  get marginLeft(): string {
    return `${this.nivel * 30}px`;
  }
}

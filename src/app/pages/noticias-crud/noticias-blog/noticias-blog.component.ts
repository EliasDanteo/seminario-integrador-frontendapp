import { Component, OnInit } from '@angular/core';
import { INoticia } from '../../../core/interfaces/INoticia.interface.js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.js';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-noticias-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './noticias-blog.component.html',
  styleUrl: './noticias-blog.component.css',
})
export class NoticiasBlogComponent implements OnInit {
  noticias: INoticia[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarNoticias();
  }

  async cargarNoticias() {
    this.http
      .get<{ message: string; data: INoticia[] }>(environment.noticiasUrl)
      .subscribe({
        next: (res) => {
          const fechaHoy = new Date();
          this.noticias = res.data.filter((noticia) => {
            const fechaPublicacion = new Date(noticia.fecha_publicacion);
            return fechaPublicacion <= fechaHoy;
          });
        },
        error: (error) => {
          console.error('Error al cargar noticias', error);
        },
      });
  }
}

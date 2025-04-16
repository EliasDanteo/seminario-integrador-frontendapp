import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { INoticia } from '../../core/interfaces/INoticia.interface';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-noticia-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './noticia-detalle.component.html',
  styleUrl: './noticia-detalle.component.css'
})
export class NoticiaDetalleComponent implements OnInit{
  noticia: INoticia | null = null 

  constructor(private http: HttpClient, private route: ActivatedRoute ) { }

  ngOnInit(): void { 
    const id = this.route.snapshot.paramMap.get('id');
    if(!id){
      console.error('No se ha proporcionado un id')
      return
    }
    const idNumber = parseInt(id)
    this.cargarNoticia(idNumber)
  }

  async cargarNoticia(id: number) {
    this.http.get<{message: string, data: INoticia}>(`${environment.noticiasUrl}/${id}`).subscribe({
      next: (res) => {
        if(res){
          this.noticia = res.data
        }else{
          throw new Error('No se ha encontrado la noticia')
        }
      },
      error: (error) => {
        console.error('Error al cargar noticia', error)
      }
    })
  }

}

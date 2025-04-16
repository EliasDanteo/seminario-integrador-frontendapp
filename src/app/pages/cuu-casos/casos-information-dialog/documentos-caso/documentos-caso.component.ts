import { Component, Input, OnInit } from '@angular/core';
import IDocumentos from '../../../../core/interfaces/IDocumentos.interface.js';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ICaso } from '../../../../core/interfaces/ICaso.interface.js';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.js';

@Component({
  selector: 'app-documentos-caso',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './documentos-caso.component.html',
  styleUrl: './documentos-caso.component.css',
})
export class DocumentosCasoComponent implements OnInit {
  @Input() caso: ICaso | null = null;
  documentos: IDocumentos[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    if (this.caso) {
      this.loadDocuments();
    }
  }

  loadDocuments() {
    if (this.caso) {
      this.httpClient
        .get<{ message: string; data: IDocumentos[] }>(
          `${environment.documentosUrl}/por-caso/${this.caso.id}`
        )
        .subscribe((res) => {
          this.documentos = res.data;
        });
    }
    console.log(this.documentos);
  }

  deleteDocument(documento: IDocumentos) {
    {
      this.httpClient
        .delete(`http://localhost:3000/api/casos/documentos/${documento.id}`)
        .subscribe(() => {
          this.loadDocuments();
        });
    }
  }

  uploadDocument(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('casoId', this.caso!.id.toString());

    this.httpClient
      .post('http://localhost:3000/api/casos/documentos', formData)
      .subscribe(() => {
        this.loadDocuments();
      });
  }
}

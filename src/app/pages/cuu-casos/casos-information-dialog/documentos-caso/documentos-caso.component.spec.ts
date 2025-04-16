import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosCasoComponent } from './documentos-caso.component';

describe('DocumentosCasoComponent', () => {
  let component: DocumentosCasoComponent;
  let fixture: ComponentFixture<DocumentosCasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosCasoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosCasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosListComponent } from './documentos-list.component';

describe('DocumentosListComponent', () => {
  let component: DocumentosListComponent;
  let fixture: ComponentFixture<DocumentosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

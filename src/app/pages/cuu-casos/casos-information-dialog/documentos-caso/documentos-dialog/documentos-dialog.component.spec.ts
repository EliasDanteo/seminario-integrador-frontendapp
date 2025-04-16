import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosDialogComponent } from './documentos-dialog.component';

describe('DocumentosDialogComponent', () => {
  let component: DocumentosDialogComponent;
  let fixture: ComponentFixture<DocumentosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

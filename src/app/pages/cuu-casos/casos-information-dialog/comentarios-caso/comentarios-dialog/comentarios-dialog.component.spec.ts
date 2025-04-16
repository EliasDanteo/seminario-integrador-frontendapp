import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosDialogComponent } from './comentarios-dialog.component';

describe('ComentariosDialogComponent', () => {
  let component: ComentariosDialogComponent;
  let fixture: ComponentFixture<ComentariosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComentariosDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentariosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

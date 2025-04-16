import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosUnidadComponent } from './comentarios-unidad.component';

describe('ComentariosUnidadComponent', () => {
  let component: ComentariosUnidadComponent;
  let fixture: ComponentFixture<ComentariosUnidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComentariosUnidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentariosUnidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

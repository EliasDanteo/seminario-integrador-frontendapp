import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaDetalleComponent } from './noticia-detalle.component';

describe('NoticiaDetalleComponent', () => {
  let component: NoticiaDetalleComponent;
  let fixture: ComponentFixture<NoticiaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

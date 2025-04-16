import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesCasoComponent } from './detalles-caso.component';

describe('DetallesCasoComponent', () => {
  let component: DetallesCasoComponent;
  let fixture: ComponentFixture<DetallesCasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesCasoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesCasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

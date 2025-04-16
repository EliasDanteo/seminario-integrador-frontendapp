import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosCasoComponent } from './abogados-caso.component';

describe('AbogadosCasoComponent', () => {
  let component: AbogadosCasoComponent;
  let fixture: ComponentFixture<AbogadosCasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbogadosCasoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbogadosCasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

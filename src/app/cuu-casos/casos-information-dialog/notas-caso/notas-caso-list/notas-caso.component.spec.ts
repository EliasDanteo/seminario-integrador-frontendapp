import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasCasoComponent } from './notas-caso.component';

describe('NotasCasoComponent', () => {
  let component: NotasCasoComponent;
  let fixture: ComponentFixture<NotasCasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasCasoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasCasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

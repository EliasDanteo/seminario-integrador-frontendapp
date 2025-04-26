import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosTurnosDialogComponent } from './horarios-turnos-dialog.component';

describe('HorariosTurnosDialogComponent', () => {
  let component: HorariosTurnosDialogComponent;
  let fixture: ComponentFixture<HorariosTurnosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosTurnosDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorariosTurnosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

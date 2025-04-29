import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosTurnosListComponent } from './horarios-turnos-list.component';

describe('HorariosTurnosListComponent', () => {
  let component: HorariosTurnosListComponent;
  let fixture: ComponentFixture<HorariosTurnosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosTurnosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorariosTurnosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCasosListComponent } from './mis-casos-list.component';

describe('MisCasosListComponent', () => {
  let component: MisCasosListComponent;
  let fixture: ComponentFixture<MisCasosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisCasosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisCasosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

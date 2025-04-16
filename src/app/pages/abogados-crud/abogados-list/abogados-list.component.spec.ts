import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosListComponent } from './abogados-list.component';

describe('AbogadosListComponent', () => {
  let component: AbogadosListComponent;
  let fixture: ComponentFixture<AbogadosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbogadosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbogadosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

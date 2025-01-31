import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosDialogComponent } from './abogados-dialog.component';

describe('AbogadosDialogComponent', () => {
  let component: AbogadosDialogComponent;
  let fixture: ComponentFixture<AbogadosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbogadosDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbogadosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

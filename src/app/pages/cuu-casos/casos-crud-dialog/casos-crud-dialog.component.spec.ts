import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosCrudDialogComponent } from './casos-crud-dialog.component';

describe('CasosCrudDialogComponent', () => {
  let component: CasosCrudDialogComponent;
  let fixture: ComponentFixture<CasosCrudDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosCrudDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosCrudDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

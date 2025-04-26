import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPagoDialogComponent } from './plan-pago-dialog.component';

describe('PlanPagoDialogComponent', () => {
  let component: PlanPagoDialogComponent;
  let fixture: ComponentFixture<PlanPagoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanPagoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanPagoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeDialogComponent } from './mensaje-dialog.component';

describe('MensajeDialogComponent', () => {
  let component: MensajeDialogComponent;
  let fixture: ComponentFixture<MensajeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

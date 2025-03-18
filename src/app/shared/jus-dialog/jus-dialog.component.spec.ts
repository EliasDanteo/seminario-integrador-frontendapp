import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JusDialogComponent } from './jus-dialog.component';

describe('JusDialogComponent', () => {
  let component: JusDialogComponent;
  let fixture: ComponentFixture<JusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JusDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

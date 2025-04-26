import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesDialogComponent } from './informes-dialog.component';

describe('InformesDialogComponent', () => {
  let component: InformesDialogComponent;
  let fixture: ComponentFixture<InformesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

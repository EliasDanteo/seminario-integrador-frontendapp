import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosInformationDialogComponent } from './casos-information-dialog.component';

describe('CasosInformationDialogComponent', () => {
  let component: CasosInformationDialogComponent;
  let fixture: ComponentFixture<CasosInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosInformationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

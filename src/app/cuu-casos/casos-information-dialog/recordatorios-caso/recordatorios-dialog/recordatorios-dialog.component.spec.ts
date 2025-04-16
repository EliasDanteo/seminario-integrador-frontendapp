import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordatoriosDialogComponent } from './recordatorios-dialog.component';

describe('RecordatoriosDialogComponent', () => {
  let component: RecordatoriosDialogComponent;
  let fixture: ComponentFixture<RecordatoriosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordatoriosDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordatoriosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

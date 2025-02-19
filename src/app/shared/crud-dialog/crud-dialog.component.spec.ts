import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDDialogComponent } from './crud-dialog.component';

describe('CrudDialogComponent', () => {
  let component: CRUDDialogComponent;
  let fixture: ComponentFixture<CRUDDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CRUDDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CRUDDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasCasoDialogComponent } from './notas-caso-dialog.component';

describe('NotasCasoDialogComponent', () => {
  let component: NotasCasoDialogComponent;
  let fixture: ComponentFixture<NotasCasoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasCasoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasCasoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

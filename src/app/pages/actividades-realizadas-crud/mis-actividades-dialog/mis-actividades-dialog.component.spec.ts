import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisActividadesDialogComponent } from './mis-actividades-dialog.component';

describe('MisActividadesDialogComponent', () => {
  let component: MisActividadesDialogComponent;
  let fixture: ComponentFixture<MisActividadesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisActividadesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisActividadesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

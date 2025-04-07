import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaCrudDialogComponent } from './noticia-crud-dialog.component';

describe('NoticiaCrudDialogComponent', () => {
  let component: NoticiaCrudDialogComponent;
  let fixture: ComponentFixture<NoticiaCrudDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiaCrudDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiaCrudDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

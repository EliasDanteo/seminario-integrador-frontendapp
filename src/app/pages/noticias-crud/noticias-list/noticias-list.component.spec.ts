import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasListComponent } from './noticias-list.component';

describe('NoticiasListComponent', () => {
  let component: NoticiasListComponent;
  let fixture: ComponentFixture<NoticiasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesListComponent } from './actividades-list.component';

describe('ActividadesListComponent', () => {
  let component: ActividadesListComponent;
  let fixture: ComponentFixture<ActividadesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

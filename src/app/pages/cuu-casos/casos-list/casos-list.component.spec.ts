import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosListComponent } from './casos-list.component';

describe('CasosListComponent', () => {
  let component: CasosListComponent;
  let fixture: ComponentFixture<CasosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

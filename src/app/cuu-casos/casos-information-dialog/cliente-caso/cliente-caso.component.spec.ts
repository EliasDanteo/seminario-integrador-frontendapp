import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCasoComponent } from './cliente-caso.component';

describe('ClienteCasoComponent', () => {
  let component: ClienteCasoComponent;
  let fixture: ComponentFixture<ClienteCasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCasoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteCasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

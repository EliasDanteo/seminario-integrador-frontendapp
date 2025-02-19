import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretariosListComponent } from './secretarios-list.component';

describe('SecretariosListComponent', () => {
  let component: SecretariosListComponent;
  let fixture: ComponentFixture<SecretariosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretariosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretariosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

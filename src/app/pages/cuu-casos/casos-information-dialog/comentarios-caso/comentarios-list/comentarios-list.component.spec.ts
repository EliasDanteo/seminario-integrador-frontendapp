import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosListComponent } from './comentarios-list.component';

describe('ComentariosListComponent', () => {
  let component: ComentariosListComponent;
  let fixture: ComponentFixture<ComentariosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComentariosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentariosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

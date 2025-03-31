import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasBlogComponent } from './noticias-blog.component';

describe('NoticiasBlogComponent', () => {
  let component: NoticiasBlogComponent;
  let fixture: ComponentFixture<NoticiasBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiasBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

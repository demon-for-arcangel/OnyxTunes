import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGenresComponent } from './create-genres.component';

describe('CreateGenresComponent', () => {
  let component: CreateGenresComponent;
  let fixture: ComponentFixture<CreateGenresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGenresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGenresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGenresComponent } from './update-genres.component';

describe('UpdateGenresComponent', () => {
  let component: UpdateGenresComponent;
  let fixture: ComponentFixture<UpdateGenresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGenresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateGenresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

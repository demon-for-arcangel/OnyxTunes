import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAlbumsComponent } from './create-albums.component';

describe('CreateAlbumsComponent', () => {
  let component: CreateAlbumsComponent;
  let fixture: ComponentFixture<CreateAlbumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAlbumsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

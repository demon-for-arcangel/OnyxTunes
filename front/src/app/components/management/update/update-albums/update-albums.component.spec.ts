import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAlbumsComponent } from './update-albums.component';

describe('UpdateAlbumsComponent', () => {
  let component: UpdateAlbumsComponent;
  let fixture: ComponentFixture<UpdateAlbumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAlbumsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

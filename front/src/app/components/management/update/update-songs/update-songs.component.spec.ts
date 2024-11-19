import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSongsComponent } from './update-songs.component';

describe('UpdateSongsComponent', () => {
  let component: UpdateSongsComponent;
  let fixture: ComponentFixture<UpdateSongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSongsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewplayerComponent } from './reviewplayer.component';

describe('ReviewplayerComponent', () => {
  let component: ReviewplayerComponent;
  let fixture: ComponentFixture<ReviewplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewplayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

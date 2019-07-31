import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictorialIndexComponent } from './pictorial-index.component';

describe('PictorialIndexComponent', () => {
  let component: PictorialIndexComponent;
  let fixture: ComponentFixture<PictorialIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictorialIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictorialIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

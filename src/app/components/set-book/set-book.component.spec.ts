import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBookComponent } from './set-book.component';

describe('SetBookComponent', () => {
  let component: SetBookComponent;
  let fixture: ComponentFixture<SetBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

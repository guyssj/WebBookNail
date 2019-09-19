import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBookComponent } from './change-book.component';

describe('ChangeBookComponent', () => {
  let component: ChangeBookComponent;
  let fixture: ComponentFixture<ChangeBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBookDialogComponent } from './set-book-dialog.component';

describe('SetBookDialogComponent', () => {
  let component: SetBookDialogComponent;
  let fixture: ComponentFixture<SetBookDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetBookDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetBookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvDialogComponent } from './adv-dialog.component';

describe('AdvDialogComponent', () => {
  let component: AdvDialogComponent;
  let fixture: ComponentFixture<AdvDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

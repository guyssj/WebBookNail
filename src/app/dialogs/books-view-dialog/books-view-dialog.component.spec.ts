import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksViewDialogComponent } from './books-view-dialog.component';

describe('BooksViewDialogComponent', () => {
  let component: BooksViewDialogComponent;
  let fixture: ComponentFixture<BooksViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooksViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

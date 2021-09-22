import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-books-view-dialog',
  templateUrl: './books-view-dialog.component.html',
  styleUrls: ['./books-view-dialog.component.css']
})
export class BooksViewDialogComponent {
  public localRes: any;
  hidetheSer: boolean;
  showSer: boolean = true;
  bookFound: any;

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: any,
    public dialogRef: MatDialogRef<BooksViewDialogComponent>) {
  }
  whenCustomerFound(event) {
    if (event) {
      this.bookFound = event;
      this.hidetheSer = true;
    }
    else {
      console.log(event);
    }
  }

  clear(event) {
    if (event) {
      this.bookFound = null;
      this.hidetheSer = false;
    }
    this.showSer = false;
  }

  showPanel(event) {
    this.showSer = true;
  }
}

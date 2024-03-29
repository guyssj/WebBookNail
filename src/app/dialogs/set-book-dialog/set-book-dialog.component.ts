import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-set-book-dialog',
  templateUrl: './set-book-dialog.component.html',
  styleUrls: ['./set-book-dialog.component.css']
})
export class SetBookDialogComponent {
  public localRes: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: any,
    public dialogRef: MatDialogRef<SetBookDialogComponent>) {
  }
  closeDialog() {
    this.dialogRef.close(false);
  }
}

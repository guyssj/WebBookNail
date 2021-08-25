import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  localRes:any;
  constructor(@Inject(MAT_DIALOG_DATA) 
   public data: any,
   public dialogRef: MatDialogRef<DialogComponent>) {
  }
}

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-adv-dialog',
  templateUrl: './adv-dialog.component.html',
  styleUrls: ['./adv-dialog.component.css']
})
export class AdvDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: any,
    public dialogRef: MatDialogRef<AdvDialogComponent>) {
  }

}

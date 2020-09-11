import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MessageConfig } from '../components/MessageConfig';
import { DialogContentExampleDialog } from '../components/set-book/set-book.component';
import { take } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  /**
* 
* Open dialog message
* 
* @param messageObj 
* 
* @param time 
*/
  openDialog(messageObj: MessageConfig, time) {
    this.dialog.open(DialogContentExampleDialog, {
      data: messageObj
    });
    timer(time, 1000).pipe(
      take(1)).subscribe(x => {
        this.dialog.closeAll();
      })
  }
}

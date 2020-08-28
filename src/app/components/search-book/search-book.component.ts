import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Customer } from 'src/app/classes/Customer';
import { Book } from 'src/app/classes/Book';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { DialogContentExampleDialog } from '../set-book/set-book.component';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { addDays } from 'date-fns';

@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.css']
})
export class SearchBookComponent implements OnInit {
  phoneNumber:string;
  constructor(private API:ApiServiceService,private dialog: MatDialog) { }
  @Output() BookFounded = new EventEmitter<Book>();
  @Input() localRes:any;
  dateNow: Date = new Date(Date.now());
  reactiveForm:FormGroup;
  ngOnInit() {

  }

  //TODO:change for working only with ID!!!
  SearchByPhone(phone:string){
    this.API.GetCustomerByPhone(phone).subscribe(res => {
      this.API.GetBookByCustomer(res.Result).subscribe(book =>{
        if(book.Result.BookID > 0){
          debugger;
          var dateNowPlus2 = addDays(this.dateNow, 2);
          var minDate = new Date(dateNowPlus2.toISOString().split("T")[0]);
          var dateBook: Date = new Date(book.Result.StartDate);
          if(dateBook.getTime() >= minDate.getTime())
            this.BookFounded.emit(book.Result);
          else
             this.openDialog({message: this.localRes.LimitDaySetBook , type:typeMessage.Error},3000);

        }
        else{
          this.openDialog({message: this.localRes.CustomerNotFound , type:typeMessage.Error},3000);
        }
      },error=>{
        this.openDialog({message: this.localRes.CustomerNotFound , type:typeMessage.Error},3000);
      })
    })
  }


    /**
   * 
   * Open dialog message
   * 
   * @param messageObj 
   * 
   * @param time 
   */
  openDialog(messageObj:MessageConfig, time) {
    this.dialog.open(DialogContentExampleDialog, {
      data:messageObj
    });
    timer(time, 1000).pipe(
      take(1)).subscribe(x => {
        this.dialog.closeAll();
      })
  }

}

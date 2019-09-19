import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiServiceService } from 'src/app/api-service.service';
import { Customer } from 'src/app/Customer';
import { Book } from 'src/app/Book';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { DialogContentExampleDialog } from '../set-book/set-book.component';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

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
  reactiveForm:FormGroup;
  ngOnInit() {

  }

  SearchByPhone(phone:string){
    this.API.GetCustomerByPhone(phone).subscribe(res => {
      this.API.GetBookByCustomer(res.Result).subscribe(book =>{
        if(book.Result.BookID > 0){
          this.reactiveForm = new FormGroup({
            firstName: new FormControl(res.Result.FirstName, Validators.required),
            lastName: new FormControl(res.Result.LastName, Validators.required),
            phoneNumber: new FormControl(res.Result.PhoneNumber, Validators.required),
            date: new FormControl(book.Result.StartDate, Validators.required),
            timeSlot: new FormControl(null, Validators.required),
            service: new FormControl(null, Validators.required),
            ServcieType: new FormControl(null, Validators.required)
          });
          this.BookFounded.emit(book.Result);
        }
        else{
          this.openDialog({message: this.localRes.CustomerNotFound , type:typeMessage.Error},3000)
        }
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

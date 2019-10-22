import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { Book } from 'src/app/classes/Book';
import { Customer } from 'src/app/classes/Customer';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { addDays, addMinutes } from 'date-fns';
import { CustomersComponent } from '../customers/customers.component';
import { TimeSlots } from 'src/app/classes/TimeSlots';
import { Observable, timer } from 'rxjs';
import { Services } from 'src/app/classes/Services';
import { ServiceTypes } from 'src/app/classes/servicetypes';
import { DialogContentExampleDialog } from '../set-book/set-book.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-change-book',
  templateUrl: './change-book.component.html',
  styleUrls: ['./change-book.component.css']
})
export class ChangeBookComponent implements OnInit {
  @Input() book: Book;
  @Input() localRes: any;
  customer:Customer = {
    FirstName:'',
    LastName:'',
    PhoneNumber:''
  };
  dateNow: Date = new Date(Date.now());
  maxDate: Date = addDays(this.dateNow, 30);
  newStart: string;
  newEnd: string;
  Time$:Observable<TimeSlots[]>;
  finishStartDate: Date;
  TimeSlotSelected: TimeSlots;
  ServiceSelected: Services;
  ServcieTypeSelected: ServiceTypes;
  editMode:boolean = false;
  constructor(private API: ApiServiceService,private dialog: MatDialog) {

  }

  ngOnInit() {
    this.API.getCustomerById(this.book.CustomerID).subscribe(res =>{
      debugger;
      this.newStart = this.MinToTime(this.book.StartAt);
      this.newEnd = this.MinToTime(this.book.StartAt + this.book.Durtion);
      this.customer = res.Result;
    })
   this.Time$ = this.API.getTimeByDate(this.book.StartDate);
  }


  /**
   * 
   * update a book
   * @param book 
   * 
   */
  UpdateBook(book: Book) {
    this.API.UpdateBook(book).subscribe(res => {
      debugger;
      if (res.Result) {
        this.openDialog({message: this.localRes.SuccessApp , type:typeMessage.Success},3000)
      } else {
        this.openDialog({message: this.localRes.notEnoughtime , type:typeMessage.Error},3000)
      }
    })
  }


  /**
   * 
   * Convert Minutes to Time
   * 
   * return Format HH:MM:SS
   * @param TimeMin 
   * 
   */
  MinToTime(TimeMin) {
    let hours = Math.floor(TimeMin / 60);
    let minutes = Math.floor((TimeMin - ((hours * 3600)) / 60));
    let seconds = Math.floor((TimeMin * 60) - (hours * 3600) - (minutes * 60));

    // Appends 0 when unit is less than 10
    if (hours < 10) { 
      var newH = "0" + hours; 
    }else{
      newH = hours.toString();
    }
    if (minutes < 10) {
      var newMin = "0" + minutes;
    }
    else {
      newMin = minutes.toString();
    }
    if (seconds < 10) { var newSec = "0" + seconds; }

    return newH + ':' + newMin + ':' + newSec;
  }

  /**
   * Event method when Time changed
   * 
   * Save the time when selected in minutes
   * @param event TimeSlots
   */
  onTimeChange(event:TimeSlots) {
    if(event){
      this.book.StartAt = event.id;
    }
  }

  /**
   * 
   * Event when date changed
   * @param event 
   * 
   */
  dateChange(event: MatDatepickerInputEvent<Date>) {
    this.finishStartDate = new Date(event.value);
    this.finishStartDate = this.clearTime(this.finishStartDate);
    this.finishStartDate = addMinutes(this.finishStartDate, 0);
    this.finishStartDate = addMinutes(this.finishStartDate, this.finishStartDate.getTimezoneOffset() * (-1));
    console.log(this.finishStartDate.getFullYear()+"-"+(this.finishStartDate.getMonth()+1)+"-"+this.finishStartDate.getDate());
    this.Time$ = this.API.getTimeByDate(this.finishStartDate.getFullYear()+"-"+(this.finishStartDate.getMonth()+1)+"-"+this.finishStartDate.getDate());
    
  }
    /**
   * Clear dateTime from Date
   * 
   * @param DateTime Date
   */
  clearTime(DateTime: Date): Date {
    DateTime.setMinutes(0);
    DateTime.setHours(0);
    DateTime.setSeconds(0);
    return DateTime;

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

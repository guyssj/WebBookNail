import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { Book } from 'src/app/classes/Book';
import { Customer } from 'src/app/classes/Customer';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { addDays, addMinutes } from 'date-fns';
import { CustomersComponent } from '../customers/customers.component';
import { TimeSlots } from 'src/app/classes/TimeSlots';
import { Observable, timer } from 'rxjs';
import { DialogContentExampleDialog } from '../set-book/set-book.component';
import { filter, take } from 'rxjs/operators';
import { CloseDays } from 'src/app/classes/CloseDays';
import { NgSelectComponent } from '@ng-select/ng-select';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { DialogService } from 'src/app/services/dialog.service';
import { CustomerService } from 'src/app/services/customer.service';
import { NavigationEnd, Router } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';



declare var $: any
@Component({
  selector: 'app-change-book',
  templateUrl: './change-book.component.html',
  styleUrls: ['./change-book.component.css']
})
export class ChangeBookComponent implements OnInit {
  @Input() bookDetails: any;
  book:Book = new Book();
  @ViewChild('select', { static: false }) public ngSelect: NgSelectComponent;

  @Input() localRes: any;
  customer:Customer;
  @Output() Clear = new EventEmitter<boolean>();
  dateNow: Date = new Date(Date.now());
  calendarPickerMinDate: Date = addDays(this.dateNow, 2)
  maxDate: Date = addDays(this.dateNow, 120);
  newStart: string;
  newEnd: string;
  Time$: Observable<TimeSlots[]>;
  finishStartDate: Date;
  loader:boolean = true;
  editMode: boolean = false;
  previousUrl:string;
  constructor(private router:Router,private booksService:BooksService, private API: ApiServiceService,private cusService: CustomerService, private dialog: DialogService,private googleAnalyticsService:GoogleAnalyticsService) {

  }
  
  closeDays: CloseDays[] = [];
  FilterWeekend = (d: Date): boolean => {
    let days;
    if (d.getDate() < 10 && d.getMonth() + 1 < 10) {
      days = d.getFullYear() + "-" + "0" + (d.getMonth() + 1) + "-" + "0" + d.getDate()
    }
    else if (d.getMonth() + 1 < 10 && d.getDate() > 9) {
      days = d.getFullYear() + "-" + "0" + (d.getMonth() + 1) + "-" + d.getDate()
    }
    else if(d.getDate() < 10 && d.getMonth() + 1 > 9){
      days = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + "0" + d.getDate()
    }
    else {
      days = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    }
    const sat = d.getDay();
    let DaytoClose = this.closeDays.filter(date=> date.Date == days);
    if(DaytoClose.length > 0 || sat == 6){
      return false;
    }
    else{
      return true;
    }
    // console.log(this.dates[d.toLocaleDateString("he-IL")])
    // return !this.dates[d.toLocaleDateString("he-IL")];
  }

  async getAllCloseDays() {
    this.closeDays = await this.API.getAllCloseDays()
  }

  ngOnInit() {
    debugger;
    
    this.book = this.bookDetails;
    this.googleAnalyticsService
    .pageview({ page_title: "שינוי התור", page_path: "/updatebook" });
    this.getAllCloseDays();
    if (!this.finishStartDate)
      this.finishStartDate = new Date(this.book.StartDate);
    if (this.router.url === "/Admin/Calendar"){
      this.cusService.getCustomerById(this.book.CustomerID).subscribe(res => {
        this.newStart = this.MinToTime(this.book.StartAt);
        this.newEnd = this.MinToTime(this.book.StartAt + this.book.Durtion);
        this.customer = res.Result;
        this.loader = false;
      })
    }
    else{
      this.cusService.GetCustomerByPhone().subscribe(res => {
        this.newStart = this.MinToTime(this.book.StartAt);
        this.newEnd = this.MinToTime(this.book.StartAt + this.book.Durtion);
        this.customer = res.Result;
        this.loader = false;
      })
    }

    this.Time$ = this.API.getTimeByDate(this.book.StartDate,this.book.Durtion);
  }


  /**
   * 
   * update a book
   * @param book 
   * 
   */
  UpdateBook(book: Book) {
    book.StartDate = this.finishStartDate.toISOString().split("T")[0];
    this.booksService.UpdateBook(book).subscribe(res => {
      if (res.Result) {
        this.dialog.openDialog({ message: this.localRes.SuccessApp, type: typeMessage.Success }, 3000);
        this
        .googleAnalyticsService
        .eventEmitter("book_update", "books", "updated", "click", 10);
        $(function () {
          $('#SerachModal').modal('toggle');
          $('#SerachModal').modal('hide');
        })
        this.Clear.emit(true);

      } else {
        this.dialog.openDialog({ message: this.localRes.notEnoughtime, type: typeMessage.Error }, 3000)
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
    } else {
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
  onTimeChange(event: TimeSlots, select: NgSelectComponent) {

    if (!event) {
      return;
    }
    else {
      this.book.StartAt = event.id;
      this.editMode = true;
      //in this request from server to check all time exist in date choosed
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
    this.book.StartDate = this.finishStartDate.toISOString();
    this.Time$ = this.API.getTimeByDate(this.finishStartDate.toISOString().split("T")[0],this.book.Durtion);
    if (!event)
    return;
  if (this.book.StartAt) {
    this.ngSelect.clearModel();
    this.editMode = false;
    this.book.StartAt = null;
  }

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


}

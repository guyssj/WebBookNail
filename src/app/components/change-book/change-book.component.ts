import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { typeMessage } from '../MessageConfig';
import { Book } from 'src/app/classes/Book';
import { Customer } from 'src/app/classes/Customer';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { addDays, addMinutes } from 'date-fns';
import { TimeSlots } from 'src/app/classes/TimeSlots';
import { Observable } from 'rxjs';
import { CloseDays } from 'src/app/classes/CloseDays';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { DialogService } from 'src/app/services/dialog.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';



declare var $: any
@Component({
  selector: 'app-change-book',
  templateUrl: './change-book.component.html',
  styleUrls: ['./change-book.component.css']
})
export class ChangeBookComponent implements OnInit {
  @Input() bookDetails: any;
  book: Book = new Book();
  //@ViewChild('select', { static: false }) public ngSelect: NgSelectComponent;

  @Input() localRes: any;
  customer: Customer;
  @Output() Clear = new EventEmitter<boolean>();
  dateNow: Date = new Date(Date.now());
  calendarPickerMinDate: Date = addDays(this.dateNow, 2)
  maxDate: Date = addDays(this.dateNow, 120);
  newStart: string;
  newEnd: string;
  Time$: Observable<TimeSlots[]>;
  Time: TimeSlots[] = [];
  noFreeTime: boolean = false;
  finishStartDate: Date = this.calendarPickerMinDate;
  loader: boolean = true;
  editMode: boolean = false;
  previousUrl: string;
  closeDays: CloseDays[] = [];
  unFreeDays: string[] = [];

  updateForm = new FormGroup({
    date: new FormControl(null, Validators.required),
    startAt: new FormControl(null, Validators.required),
  });

  constructor(private router: Router,
    private booksService: BooksService,
    private API: ApiServiceService,
    private calendarService: CalendarService,
    private cusService: CustomerService,
    private dialog: DialogService,
    private googleAnalyticsService: GoogleAnalyticsService) {

  }

  async getAllCloseDays() {
    this.closeDays = await this.calendarService.getAllCloseDays();
  }

  ngOnInit() {
    this.book = this.bookDetails;
    this.setDate(this.book.StartDate);
    this.googleAnalyticsService
      .pageview({ page_title: "שינוי התור", page_path: "/updatebook" });
    this.getAllCloseDays();
    if (this.router.url === "/Admin/Calendar") {
      this.cusService.getCustomerById(this.book.CustomerID).subscribe(res => {
        this.newStart = this.MinToTime(this.book.StartAt);
        this.customer = res.Result;
        this.loader = false;
      })
    }
    else {
      this.cusService.GetCustomerByPhone().subscribe(res => {
        this.calendarService.getUnFreeDays(this.getDateString(this.getFirstDayMonth(new Date())), this.book.Durtion).subscribe(unFree => {
          this.unFreeDays = unFree.Result;
          this.closeDays.forEach(closeDay => {
            this.unFreeDays.push(closeDay.Date);
          });
          this.newStart = this.MinToTime(this.book.StartAt);
          this.customer = res.Result;
          this.loader = false;
        })

      })
    }
    this.API.getTimeByDate(
      this.book.StartDate,
      this.book.Durtion).subscribe(res => {
        this.Time = [];
        this.noFreeTime = false;
        this.Time = res;
        //this.cdr.detectChanges();
        if (res.length == 0) {
          this.noFreeTime = true;
        }
      }, error => {
        this.noFreeTime = true;
        this.Time = [];

      });
  }
  setDate(date: Date) {
    let newDate = new Date(date);
    newDate = this.clearTime(newDate);
    newDate = addMinutes(newDate, 0);
    newDate = addMinutes(newDate, newDate.getTimezoneOffset() * (-1));
    this.finishStartDate = newDate;
  }

  /**
   * 
   * update a book
   * @param book 
   * 
   */
  UpdateBook(book: Book) {
    book.StartDate = this.getDateString(this.finishStartDate);
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
  onTimeChange(event: TimeSlots) {
    if (!event) {
      return;
    }
    else {
      this.book.StartAt = event.id;
      this.editMode = true;
      //in this request from server to check all time exist in date choosed
    }
  }
  private getDateString(date: Date): string {
    date = this.clearTime(date);
    date = addMinutes(date, 0);
    date = addMinutes(date, date.getTimezoneOffset() * (-1));
    return date.toISOString().split("T")[0];
  }

  private getFirstDayMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * 
   * Event when date changed
   * @param event 
   * 
   */
  dateChange(event) {
    if (!event)
      return;
    if (this.book.StartAt) {
      this.editMode = false;
      this.book.StartAt = null;
    }
    this.setDate(event.date);
    this.book.StartDate = this.getDateString(this.finishStartDate);
    this.API.getTimeByDate(
      this.getDateString(this.finishStartDate),
      this.book.Durtion).subscribe(res => {
        this.Time = [];
        this.noFreeTime = false;
        this.Time = res;
        //this.cdr.detectChanges();
        if (res.length == 0) {
          this.noFreeTime = true;
        }
      }, error => {
        this.noFreeTime = true;
        this.Time = [];

      });

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

import { Component, OnInit, Injectable, OnChanges, Inject, Input, ViewChild, Renderer2, HostListener } from '@angular/core';
import { LocalresService } from '../../services/localres.service';
import { ApiServiceService } from '../../services/api-service.service';
import { Observable, timer } from 'node_modules/rxjs';
import { TimeSlots } from '../../classes/TimeSlots';
import { NgbDateStruct, NgbCalendar, NgbCalendarHebrew } from '@ng-bootstrap/ng-bootstrap';
import { addDays, addMinutes } from 'date-fns';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Services } from '../../classes/Services';
import { ServiceTypes } from '../../classes/servicetypes';
import { Book } from '../../classes/Book';
import { resultsAPI } from 'src/app/classes/results';
import { Customer } from 'src/app/classes/Customer';
import { MatDialog, MAT_DIALOG_DATA, MatFormField, DateAdapter, MatDatepickerInputEvent, MatCalendar, MatCalendarHeader } from '@angular/material';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { timeInterval, take, map } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CloseDays } from 'src/app/classes/CloseDays';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { CustomerService } from 'src/app/services/customer.service';
import { BooksService } from 'src/app/services/books.service';
import { ServicetypeService } from 'src/app/services/servicetype.service';


@Component({
  selector: 'app-set-book',
  templateUrl: './set-book.component.html',
  styleUrls: ['./set-book.component.css'],
})
export class SetBookComponent implements OnInit {
  @Input() localRes: any;
  @ViewChild('select', { static: false }) public ngSelect: NgSelectComponent;
  @ViewChild(MatCalendar, { static: false }) calendar: MatCalendar<Date>;



  faCalendarAlt = faCalendarAlt;
  Time$: Observable<TimeSlots[]>
  Services$: Observable<Services[]>;
  model: NgbDateStruct;
  StartAt: number;
  EndAt: number;
  ServiceSelected: Services;
  ServcieTypeSelected: ServiceTypes;
  customer: Customer;
  ServicesTypes$: ServiceTypes[];
  dateNow: Date = new Date(Date.now());
  calendarPickerMinDate: Date = addDays(this.dateNow, 2);
  maxDate: Date = addDays(this.dateNow, 120);
  formBuilder: any;
  finishStartDate: Date;
  noFreeTime: boolean = false;
  Books: Book;
  reactiveForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, Validators.required),
    date: new FormControl(null, Validators.required),
    timeSlot: new FormControl(null, Validators.required),
    service: new FormControl(null, Validators.required),
    ServcieType: new FormControl(null, Validators.required)
  });
  DateSelected: any;
  closeDays: CloseDays[] = [];
  FilterWeekend = (d: Date): boolean => {
    let days;
    let noVacentTime = false;
    if (d.getDate() < 10 && d.getMonth() + 1 < 10) {
      days = d.getFullYear() + "-" + "0" + (d.getMonth() + 1) + "-" + "0" + d.getDate()
    }
    else if (d.getMonth() + 1 < 10 && d.getDate() > 9) {
      days = d.getFullYear() + "-" + "0" + (d.getMonth() + 1) + "-" + d.getDate()
    }
    else if (d.getDate() < 10 && d.getMonth() + 1 > 9) {
      days = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + "0" + d.getDate()
    }
    else {
      days = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    }
    const sat = d.getDay();
    if (this.finishStartDate.toISOString().split("T")[0] == days)
      noVacentTime = this.noFreeTime;
    let DaytoClose = this.closeDays.filter(date => date.Date == days);
    if (DaytoClose.length > 0 || sat == 6 || noVacentTime) {
      return false;
    }
    else {
      return true;
    }
  }

  constructor(
    private dialog: MatDialog,
    private API: ApiServiceService,
    private cusService:CustomerService,
    private booksService:BooksService,
    private servService: ServicetypeService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private adapter: DateAdapter<any>) {
    this.getAllCloseDays();
  }

  ngOnInit() {
    this.adapter.setLocale('he');
    this.Time$ = this.API.getAllTimes();
    this.Services$ = this.servService.getAllServices().pipe(map(item => item.Result));
    this.finishStartDate = this.calendarPickerMinDate;
    this.reactiveForm.patchValue({ date: this.finishStartDate });
  }

  async getAllCloseDays() {
    this.closeDays = await this.API.getAllCloseDays();
  }

  /**
   * 
   * Event when selected DatePicker
   * 
   * @param Event:MatDatepickerInputEvent
   * 
   */
  dateChange(event) {
    if (!event)
      return;
    this.noFreeTime = false;
    this.googleAnalyticsService
      .pageview({ page_title: "קביעת פגישה", page_path: "/setbook" });
    this.finishStartDate = new Date(event);
    this.finishStartDate = this.clearTime(this.finishStartDate);
    this.finishStartDate = addMinutes(this.finishStartDate, 0);
    this.finishStartDate = addMinutes(this.finishStartDate, this.finishStartDate.getTimezoneOffset() * (-1));
    this.reactiveForm.patchValue({ date: this.finishStartDate });
    if (this.StartAt) {
      this.reactiveForm.patchValue({ timeSlot: null });
      this.StartAt = null;
    }

    if (this.ServcieTypeSelected) {
      this.Time$ = this.API.getTimeByDate(this.finishStartDate.toISOString().split("T")[0], this.ServcieTypeSelected.Duration);
      this.Time$.subscribe(res => {
        if (res.length == 0) {
          this.noFreeTime = true;
          this.calendar.updateTodaysDate();
        }
      })
    }
  }

  /**
   * 
   * Method when submit button was clicked
   * 
   * check if all form field is valid
   */
  onSubmit() {
    if (!this.reactiveForm.valid) {
      Object.keys(this.reactiveForm.controls).forEach(field => { // {1}
        const control = this.reactiveForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
    else {
      this.setBook();
    }
  }

  /**
   * Event method when Time changed
   * 
   * Save the time when selected in minutes
   * @param event TimeSlots
   */
  onTimeChange(event: TimeSlots) {
    if (!event)
      return;

    if (this.finishStartDate) {
      this.StartAt = event.id;
      this.reactiveForm.patchValue({ timeSlot: event })
    }
    else {
      this.StartAt = event.id;
      this.reactiveForm.patchValue({ timeSlot: event })
    }
  }

  /**
   * Method event when selected a Service
   * 
   * Go to api with service selected and get ServiceTypes
   * @param event Services
   */
  onServiceChange(event: Services) {
    if (this.ServcieTypeSelected) {
      this.reactiveForm.value.ServcieType = null;
      this.ngSelect.clearModel();
      this.ServcieTypeSelected = null;
    }
    try {
      this.servService.getAllServicetypesByServiceID(event.ServiceID = !undefined ? event.ServiceID : 4).subscribe(api => {
        this.ServicesTypes$ = api.Result;
        this.ServiceSelected = this.reactiveForm.value.service;
      })
    } catch (error) {

    }
  }
  /**
   * Method event when Service type selected
   * 
   * Save the Service type selected
   * 
   * @param event ServiceTypes
   */
  onServiceTypeChange(event: ServiceTypes, select: NgSelectComponent) {
    if (this.StartAt) {
      this.reactiveForm.patchValue({ timeSlot: null });
      this.StartAt = null;
    }
    if (!event) {
      this.ServcieTypeSelected = null;
      return;
    }
    this
      .googleAnalyticsService
      .eventEmitter("change_servicetyoe", "servicetype", "changeType", "change", 10);
    this.ServcieTypeSelected = event;

    //check close dates
    for (let i = 0; i < this.closeDays.length; i++) {
      let element = this.closeDays[i].Date;
      if (element == this.finishStartDate.toISOString().split("T")[0])
        this.finishStartDate = addDays(this.finishStartDate, 1);
    }

    if( this.finishStartDate.getDay() == 6)
      this.finishStartDate = addDays(this.finishStartDate, 1);

    this.Time$ = this.API.getTimeByDate(this.finishStartDate.toISOString().split("T")[0], this.ServcieTypeSelected.Duration);
    this.Time$.subscribe(res => {
      if (res.length == 0) {
        this.noFreeTime = true;
        this.calendar.updateTodaysDate();
      }
    })
  }

  monthChange(event) {
    this.reactiveForm.patchValue({ timeSlot: null, date: null });
    this.dateChange(event);
    this.StartAt = null;
  }


  /**
   * Berfore Save book Customer save
   * 
   * Set booking with all parametres
   */
  setBook() {
    this.customer = {
      FirstName: this.reactiveForm.get("firstName").value,
      LastName: this.reactiveForm.get("lastName").value,
      PhoneNumber: this.reactiveForm.get("phoneNumber").value
    }
    this.cusService.addCustomer(this.customer).subscribe(id => {
      this.customer.CustomerID = id.Result;
      this.Books = new Book();
      this.Books = {
        CustomerID: this.customer.CustomerID,
        StartDate: this.finishStartDate.toISOString().split("T")[0],
        StartAt: this.StartAt,
        ServiceID: this.ServiceSelected.ServiceID,
        ServiceTypeID: this.ServcieTypeSelected.ServiceTypeID,
        Durtion: this.ServcieTypeSelected.Duration
      }
      this.booksService.setBook(this.Books).subscribe(results => {
        if (results.Result > 0) {
          this
            .googleAnalyticsService
            .eventEmitter("set_book", "setbook", "setbooking", "click", 10);
          this.openDialog({ message: this.localRes.SuccessApp, type: typeMessage.Success }, 3000)
          this.clearForm();
        }
        else {
          this.openDialog({ message: results.ErrorMessage, type: typeMessage.Error }, 5000)
        }
      }, error => {
        this.openDialog({ message: error.ErrorMessage, type: typeMessage.Error }, 5000)
      })

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

  /**
   * Clear all field from the Set book Form
   */
  clearForm() {
    this.Books = null;
    this.reactiveForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      timeSlot: new FormControl(null, Validators.required),
      service: new FormControl(null, Validators.required),
      ServcieType: new FormControl(null, Validators.required)
    });
    this.customer = null;
    this.ServiceSelected = null;
    this.ServcieTypeSelected = null;
  }

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
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'set-book.component-dialog.html',
})
export class DialogContentExampleDialog {
  get MessageResult() { return typeMessage; }
  constructor(@Inject(MAT_DIALOG_DATA) public data: MessageConfig) {

  }

}

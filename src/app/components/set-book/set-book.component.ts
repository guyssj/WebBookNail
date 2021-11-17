import { Component, OnInit, Inject, Input, ChangeDetectorRef } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { Observable, timer } from 'node_modules/rxjs';
import { TimeSlots } from '../../classes/TimeSlots';
import { addDays, addMinutes, addMonths } from 'date-fns';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Services } from '../../classes/Services';
import { ServiceTypes } from '../../classes/servicetypes';
import { Book } from '../../classes/Book';
import { Customer } from 'src/app/classes/Customer';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { take, map } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CloseDays } from 'src/app/classes/CloseDays';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { CustomerService } from 'src/app/services/customer.service';
import { BooksService } from 'src/app/services/books.service';
import { ServicetypeService } from 'src/app/services/servicetype.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { DateChangeEvent } from '../calendar-picker/calendar-picker.component';


@Component({
  selector: 'app-set-book',
  templateUrl: './set-book.component.html',
  styleUrls: ['./set-book.component.css'],
})
export class SetBookComponent implements OnInit {
  @Input() localRes: any;
  faCalendarAlt = faCalendarAlt;
  Time: TimeSlots[] = [];
  Services$: Observable<Services[]>;
  ServcieTypeSelected: ServiceTypes;
  customer: Customer;
  ServicesTypes$: ServiceTypes[];
  dateNow: Date = new Date(Date.now());
  calendarPickerMinDate: Date = addDays(this.dateNow, 2);
  maxDate: Date = addDays(this.dateNow, 120);
  noFreeTime: boolean = false;
  Books: Book;
  unFreeDays: string[] = [];
  reactiveForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, Validators.required),
    date: new FormControl(null, Validators.required),
    startAt: new FormControl(null, Validators.required),
    service: new FormControl(null, Validators.required),
    ServiceType: new FormControl(null, Validators.required)
  });
  closeDays: CloseDays[] = [];
  loader: boolean = false;

  constructor(
    private dialog: MatDialog,
    private API: ApiServiceService,
    private cusService: CustomerService,
    private booksService: BooksService,
    private servService: ServicetypeService,
    private calendarService: CalendarService,
    private cdr: ChangeDetectorRef,
    private googleAnalyticsService: GoogleAnalyticsService,
    private authServ: AuthTokenService,
    private adapter: DateAdapter<any>) {
    this.getAllCloseDays();
  }



  ngOnInit() {
    this.adapter.setLocale('he');
    this.Services$ = this.servService.getAllServices().pipe(map(item => item.Result));
    this.setDate(this.calendarPickerMinDate);
    this.googleAnalyticsService
      .pageview({ page_title: "קביעת פגישה", page_path: "/setbook" });
    if (this.authServ.currentUserValue)
      this.reactiveForm.patchValue({ phoneNumber: this.authServ.currentUserValue.userName });
  }

  setDate(date: Date) {
    let newDate = new Date(date);
    newDate = this.clearTime(newDate);
    newDate = addMinutes(newDate, 0);
    newDate = addMinutes(newDate, newDate.getTimezoneOffset() * (-1));
    this.reactiveForm.patchValue({ date: newDate });
  }
  async getAllCloseDays() {
    this.closeDays = await this.calendarService.getAllCloseDays();
  }

  /**
   * 
   * Event when selected DatePicker
   * 
   * @param Event:MatDatepickerInputEvent
   * 
   */
  dateChange(event: DateChangeEvent) {
    if (!event)
      return;

    this.setDate(event.date);
    if (this.reactiveForm.get('startAt').value) {
      this.reactiveForm.patchValue({ startAt: null });
    }
    this.Time = [];

    if (this.reactiveForm.get('ServiceType').value) {
      this.API.getTimeByDate(
        this.getDateString(this.reactiveForm.get('date').value),
        this.reactiveForm.get('ServiceType').value.Duration).subscribe(res => {
          this.Time = [];
          this.noFreeTime = false;

          this.Time = res;
          this.cdr.detectChanges();
          if (res.length == 0) {
            this.noFreeTime = true;
          }
        }, error => {
          this.noFreeTime = true;
          this.Time = [];

        });
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
    this.reactiveForm.patchValue({ startAt: event.id })
  }

  /**
   * Method event when selected a Service
   * 
   * Go to api with service selected and get ServiceTypes
   * @param event Services
   */
  onServiceChange(event: MatSelectChange) {
    if (!event && !this.reactiveForm.controls.ServiceType.value) {
      this.reactiveForm.patchValue({ service: null })
      this.cdr.detectChanges();
      return;
    }
    if (this.reactiveForm.controls.ServiceType.value && event) {
      this.reactiveForm.patchValue({ ServiceType: null })
      this.ServcieTypeSelected = null;
      this.servService.
        getAllServicetypesByServiceID(event.value.ServiceID = !undefined ? event.value.ServiceID : 0).subscribe(api => {
          this.ServicesTypes$ = api.Result;
          this.cdr.detectChanges();
        })
      return;
    }
    if (!event && this.reactiveForm.controls.ServiceType.value) {
      this.reactiveForm.patchValue({ service: null, ServiceType: null })
      this.ServcieTypeSelected = null;
      this.cdr.detectChanges();
    }
    else {
      this.servService.
        getAllServicetypesByServiceID(event.value.ServiceID = !undefined ? event.value.ServiceID : 4).subscribe(api => {
          this.ServicesTypes$ = api.Result;
          this.cdr.detectChanges();
        })
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

  monthChange(event) {
    if (this.reactiveForm.get("startAt").value) {
      this.reactiveForm.patchValue({ startAt: null });
    }
  }
  /**
   * Method event when Service type selected
   * 
   * Save the Service type selected
   * 
   * @param event ServiceTypes
   */
  async onServiceTypeChange(event: MatSelectChange) {
    if (!event) {
      this.reactiveForm.patchValue({ ServiceType: null });
      this.ServcieTypeSelected = null;
      return;
    }
    if (this.reactiveForm.get("startAt").value) {
      this.reactiveForm.patchValue({ startAt: null });
    }


    this.loader = true;
    this.calendarService
      .getUnFreeDays(this.getDateString(this.getFirstDayMonth(this.reactiveForm.get('date').value)), event.value.Duration).subscribe(results => {
        this.unFreeDays = results.Result
        this.loader = false;
        this.closeDays.forEach(closeDay => {
          this.unFreeDays.push(closeDay.Date);
        });
        this
          .googleAnalyticsService
          .eventEmitter("change_servicetyoe", "servicetype", "changeType", "change", 10);

        //check if automatic selected date is shabat
        if (this.reactiveForm.get('date').value.getDay() == 6)
          this.setDate(addDays(this.reactiveForm.get('date').value, 1))

        this.Time = [];
        this.cdr.detectChanges();
        this.API.getTimeByDate(
          this.getDateString(this.reactiveForm.get('date').value),
          event.value.Duration).subscribe(resp => {
            this.Time = resp;
            if (resp.length == 0) {
              this.noFreeTime = true;
            }
            this.cdr.detectChanges();

          });
        this.ServcieTypeSelected = event.value;
      })
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
        StartDate: this.getDateString(this.reactiveForm.get("date").value),
        StartAt: this.reactiveForm.get('startAt').value,
        ServiceID: this.reactiveForm.get('service').value.ServiceID,
        ServiceTypeID: this.reactiveForm.get('ServiceType').value.ServiceTypeID,
        Durtion: this.reactiveForm.get('ServiceType').value.Duration
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
    this.customer = null;
    this.ServcieTypeSelected = null;
    this.reactiveForm.reset();
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

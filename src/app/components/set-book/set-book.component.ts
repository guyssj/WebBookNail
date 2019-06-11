import { Component, OnInit, Injectable, OnChanges, Inject } from '@angular/core';
import { LocalresService } from '../../localres.service';
import { ApiServiceService } from '../../api-service.service';
import { Observable, timer } from 'node_modules/rxjs';
import { date } from '../../date';
import { TimeSlots } from '../../TimeSlots';
import { NgbDateStruct, NgbCalendar, NgbCalendarHebrew } from '@ng-bootstrap/ng-bootstrap';
import { addDays, addMinutes } from 'date-fns';
import { NgbDateCustomParserFormatter } from '../../dateformat';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Services } from '../../Services';
import { ServiceTypes } from '../../servicetypes';
import { Book } from '../../Book';
import { resultsAPI } from 'src/app/results';
import { Customer } from 'src/app/Customer';
import { MatDialog, MAT_DIALOG_DATA, MatFormField, DateAdapter, MatDatepickerInputEvent } from '@angular/material';
import { MessageConfig } from '../MessageConfig';
import { timeInterval, take } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms';

const I18N_VALUES = {
  'he': {
    weekdays: ['ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳', 'א׳'],
    months: [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי',
      'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'he';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}


@Component({
  selector: 'app-set-book',
  templateUrl: './set-book.component.html',
  styleUrls: ['./set-book.component.css'],

  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }] // define custom NgbDatepickerI18n provider
})
export class SetBookComponent implements OnInit, OnChanges {
  localRes: any
  Date$: Observable<date[]>
  faCalendarAlt = faCalendarAlt;
  Time$: Observable<TimeSlots[]>;
  Services$: Observable<Services[]>;
  model: NgbDateStruct;
  TimeLoad: boolean = true;
  ServiceLoad: boolean = true;
  ServiceTypeLoad: boolean = true;
  TimeSlotSelected: TimeSlots;
  ServiceSelected: Services;
  ServcieTypeSelected: ServiceTypes;
  customer: Customer = {
    FirstName: '',
    LastName: '',
    PhoneNumber: ''
  }
  // ServicesTypes$: Observable<resultsAPI<ServiceTypes[]>>;
  ServicesTypes$: ServiceTypes[];
  date: { year: number, month: number };
  dateNow: Date = new Date(Date.now());
  minDate: NgbDateStruct = {
    year: this.dateNow.getFullYear(),
    month: this.dateNow.getUTCMonth() + 1,
    day: this.dateNow.getUTCDate()
  };
  maxDate: Date = addDays(this.dateNow, 30);
  maxDateNew: NgbDateStruct = {
    year: this.maxDate.getFullYear(),
    month: this.maxDate.getMonth() + 1,
    day: this.maxDate.getDate()
  }
  formBuilder: any;
  finishStartDate: Date;
  finishEndDate: Date;
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
  constructor(private localres: LocalresService, private dialog: MatDialog, private API: ApiServiceService, private adapter: DateAdapter<any>) { }
  ngOnInit() {
    this.localres.getLocalResoruce("he").subscribe(data => {
      this.localRes = data;
      console.log(this.localRes)
    })
    this.adapter.setLocale('he');
    this.Date$ = this.API.getAllDates();
    this.Time$ = this.API.getAllTimes();
    this.TimeLoad = false;
    this.Services$ = this.API.getAllServices();
    this.ServiceLoad = false;
  }

  itemSelected(event: MatDatepickerInputEvent<Date>) {
    debugger;

    this.finishStartDate = new Date(event.value)
    this.finishEndDate = new Date(event.value);
  }

  onSubmit() {
    if (!this.reactiveForm.valid) {
      Object.keys(this.reactiveForm.controls).forEach(field => { // {1}
        const control = this.reactiveForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
    else {
      this.setBook();
      console.log(this.reactiveForm.value);
    }
  }
  onTimeChange(event) {
    if (this.finishStartDate) {
      this.finishEndDate = this.clearTime(this.finishEndDate);
      this.finishStartDate = this.clearTime(this.finishStartDate);
      this.finishStartDate = addMinutes(this.finishStartDate, event.id);
      this.finishStartDate = addMinutes(this.finishStartDate, this.finishStartDate.getTimezoneOffset() * (-1));
      this.finishEndDate = addMinutes(this.finishEndDate, event.id);
      this.finishEndDate = addMinutes(this.finishEndDate, this.finishEndDate.getTimezoneOffset() * (-1));
      console.log(this.finishStartDate)
      console.log(this.finishEndDate)
    }
  }

  onServiceChange(event) {
    try {
      this.API.getAllServicetypesByServiceID(event.ServiceID = !undefined ? event.ServiceID : 4).subscribe(api => {
        debugger;
        this.ServicesTypes$ = api.Result;
        this.ServiceSelected = this.reactiveForm.value.service;
        this.ServiceTypeLoad = false;
      })
    } catch (error) {

    }
  }

  onServiceTypeChange(event) {
    this.ServcieTypeSelected = event;
    console.log(this.ServcieTypeSelected);
    this.finishEndDate = addMinutes(this.finishEndDate, event.Duration)
  }

  setBook() {
    this.customer = {
      FirstName: this.reactiveForm.value.firstName,
      LastName:this.reactiveForm.value.lastName,
      PhoneNumber:this.reactiveForm.value.phoneNumber
    }
    this.API.addCustomer(this.customer).subscribe(id => {
      this.customer.CustomerID = id.Result;
      this.Books = new Book()
      this.Books = {
        CustomerID: this.customer.CustomerID,
        StartDate: this.finishStartDate,
        ServiceID: this.ServiceSelected.ServiceID,
        EndDate: this.finishEndDate,
        ServiceTypeID: this.ServcieTypeSelected.ServiceTypeId,
        Durtion: this.ServcieTypeSelected.Duration
      }
      this.API.setBook(this.Books).subscribe(results => {
        if (results > 0) {
          this.openDialog("הפגישה נקבעה בהצלחה",5000)
          console.log(results);
        }
      })

    });
  }
  ngOnChanges(change) {
  }

  clearTime(DateTime: Date): Date {
    DateTime.setMinutes(0);
    DateTime.setHours(0);
    DateTime.setSeconds(0);
    return DateTime;

  }

  openDialog(message, time) {
    this.dialog.open(DialogContentExampleDialog, {
      data: {
        message: message
      }
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: MessageConfig) {

  }
}

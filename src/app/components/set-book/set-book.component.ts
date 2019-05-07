import { Component, OnInit, Injectable, OnChanges } from '@angular/core';
import { LocalresService } from '../../localres.service';
import { ApiServiceService } from '../../api-service.service';
import { Observable } from 'node_modules/rxjs';
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
  Date$: Observable<date[]>
  faCalendarAlt = faCalendarAlt;
  Time$: Observable<TimeSlots[]>;
  Services$: Observable<Services[]>;
  model: NgbDateStruct;
  TimeSlotSelected: TimeSlots;
  ServiceSelected: Services;
  ServcieTypeSelected: ServiceTypes;
  ServicesTypes$: Observable<ServiceTypes[]>;
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
  finishStartDate: Date;
  finishEndDate: Date;
  Books: Book;
  constructor(private localres: LocalresService, private API: ApiServiceService) { }
  ngOnInit() {

    this.Date$ = this.API.getAllDates();
    this.Time$ = this.API.getAllTimes();
    this.Services$ = this.API.getAllServices();

  }

  itemSelected(event) {
    this.finishStartDate = new Date(event.year, event.month - 1, event.day);
    this.finishEndDate = new Date(event.year, event.month - 1, event.day);
    console.log(this.finishStartDate)
    console.log(this.finishEndDate)
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
      this.ServicesTypes$ = this.API.getAllServicetypesByServiceID(event.ServiceID = !undefined ? event.ServiceID : 4);
    } catch (error) {
      this.ServicesTypes$ = this.API.getAllServicetypesByServiceID(0);
    }
  }

  onServiceTypeChange(event) {
    debugger;
    this.finishEndDate = addMinutes(this.finishEndDate, event.Duration)
  }

  setBook() {
    debugger;
    this.Books = new Book()
    this.Books = {
      CustomerID: 1,
      StartDate: this.finishStartDate,
      ServiceID: this.ServiceSelected.ServiceID,
      EndDate: this.finishEndDate,
      ServiceTypeID: this.ServcieTypeSelected.ServiceTypeId,
      Durtion: this.ServcieTypeSelected.Duration
    }
    this.API.setBook(this.Books).subscribe(results => {
      console.log(results);
    })
  }
  ngOnChanges(change) {
  }

  clearTime(DateTime: Date): Date {
    DateTime.setMinutes(0);
    DateTime.setHours(0);
    DateTime.setSeconds(0);
    return DateTime;

  }
}

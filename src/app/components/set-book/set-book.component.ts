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


@Component({
  selector: 'app-set-book',
  templateUrl: './set-book.component.html',
  styleUrls: ['./set-book.component.css'],
})
export class SetBookComponent implements OnInit {
  localRes: any
  faCalendarAlt = faCalendarAlt;
  Time$: Observable<TimeSlots[]>;
  Services$: Observable<Services[]>;
  model: NgbDateStruct;
  StartAt:number;
  EndAt:number;
  TimeSlotSelected: TimeSlots;
  ServiceSelected: Services;
  ServcieTypeSelected: ServiceTypes;
  customer: Customer;
  ServicesTypes$: ServiceTypes[];
  dateNow: Date = new Date(Date.now());
  maxDate: Date = addDays(this.dateNow, 30);
  formBuilder: any;
  finishStartDate: Date;
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
  constructor(private localres: LocalresService,
              private dialog: MatDialog, 
              private API: ApiServiceService, 
              private adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.localres.getLocalResoruce("he").subscribe(data => {
      this.localRes = data;
      console.log(this.localRes)
    })
    this.adapter.setLocale('he');
    this.Time$ = this.API.getAllTimes();
    this.Services$ = this.API.getAllServices();
  }

  /**
   * 
   * Event when selected DatePicker
   * 
   * @param Event:MatDatepickerInputEvent
   * 
   */
  itemSelected(event: MatDatepickerInputEvent<Date>) {
    this.finishStartDate = new Date(event.value);
    this.finishStartDate = this.clearTime(this.finishStartDate);
    this.finishStartDate = addMinutes(this.finishStartDate, 0);
    this.finishStartDate = addMinutes(this.finishStartDate, this.finishStartDate.getTimezoneOffset() * (-1));
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
  onTimeChange(event:TimeSlots) {
    if (this.finishStartDate) {
      this.StartAt = event.id;
    }
    else {
      this.StartAt = event.id;
    }
  }

  /**
   * Method event when selected a Service
   * 
   * Go to api with service selected and get ServiceTypes
   * @param event Services
   */
  onServiceChange(event:Services) {
    try {
      this.API.getAllServicetypesByServiceID(event.ServiceID = !undefined ? event.ServiceID : 4).subscribe(api => {
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
  onServiceTypeChange(event:ServiceTypes) {
    this.ServcieTypeSelected = event;
  }

  /**
   * Berfore Save book Customer save
   * 
   * Set booking with all parametres
   */
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
        StartAt:this.StartAt,
        ServiceID: this.ServiceSelected.ServiceID,
        ServiceTypeID: this.ServcieTypeSelected.ServiceTypeId,
        Durtion: this.ServcieTypeSelected.Duration
      }
      this.API.setBook(this.Books).subscribe(results => {
        if (results.Result > 0) {
          this.openDialog("הפגישה נקבעה בהצלחה",5000)
          console.log(results);
        }
        else{
          this.openDialog(results.ErrorMessage,5000)
        }
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

import { Component, OnInit, Injectable, OnChanges, Inject, Input } from '@angular/core';
import { LocalresService } from '../../localres.service';
import { ApiServiceService } from '../../api-service.service';
import { Observable, timer } from 'node_modules/rxjs';
import { TimeSlots } from '../../TimeSlots';
import { NgbDateStruct, NgbCalendar, NgbCalendarHebrew } from '@ng-bootstrap/ng-bootstrap';
import { addDays, addMinutes } from 'date-fns';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Services } from '../../Services';
import { ServiceTypes } from '../../servicetypes';
import { Book } from '../../Book';
import { resultsAPI } from 'src/app/results';
import { Customer } from 'src/app/Customer';
import { MatDialog, MAT_DIALOG_DATA, MatFormField, DateAdapter, MatDatepickerInputEvent } from '@angular/material';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { timeInterval, take } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';


@Component({
  selector: 'app-set-book',
  templateUrl: './set-book.component.html',
  styleUrls: ['./set-book.component.css'],
})
export class SetBookComponent implements OnInit {
  @Input() localRes:any;
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
  notEnoughtime:boolean = false;
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
  dateChange(event: MatDatepickerInputEvent<Date>) {
    this.finishStartDate = new Date(event.value);
    this.finishStartDate = this.clearTime(this.finishStartDate);
    this.finishStartDate = addMinutes(this.finishStartDate, 0);
    this.finishStartDate = addMinutes(this.finishStartDate, this.finishStartDate.getTimezoneOffset() * (-1));
    console.log(this.finishStartDate.getFullYear()+"-"+(this.finishStartDate.getMonth()+1)+"-"+this.finishStartDate.getDate());
    this.Time$ = this.API.getTimeByDate(this.finishStartDate.getFullYear()+"-"+(this.finishStartDate.getMonth()+1)+"-"+this.finishStartDate.getDate());
    
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
  onServiceTypeChange(event:ServiceTypes,select:NgSelectComponent) {
    debugger;
    this.ServcieTypeSelected = event;
    //in this request from server to check all time exist in date choosed
    this.API.TimeExist(this.finishStartDate.getFullYear()+"-"+(this.finishStartDate.getMonth()+1)+"-"+this.finishStartDate.getDate()).subscribe(arry => {
      var timeTotal = this.StartAt + this.ServcieTypeSelected.Duration
      this.notEnoughtime = false;
      for (let i = 0; i < arry.Result.length; i++) {
        if(arry.Result[i] == timeTotal){
          this.notEnoughtime = true;
          this.reactiveForm.value.ServcieType = null;
          this.ServcieTypeSelected = null;
          select.clearModel();
        }
      }
    })
    
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
        ServiceTypeID: this.ServcieTypeSelected.ServiceTypeID,
        Durtion: this.ServcieTypeSelected.Duration
      }
      this.API.setBook(this.Books).subscribe(results => {
        if (results.Result > 0) {
          this.openDialog({message: this.localRes.SuccessApp , type:typeMessage.Success},3000)
          this.clearForm();
        }
        else{
          this.openDialog({message: results.ErrorMessage , type:typeMessage.Error},5000)
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

  /**
   * Clear all field from the Set book Form
   */
  clearForm(){
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
  }

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
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'set-book.component-dialog.html',
})
export class DialogContentExampleDialog {
  get MessageResult() { return typeMessage; }
  constructor(@Inject(MAT_DIALOG_DATA) public data: MessageConfig) {

  }

}

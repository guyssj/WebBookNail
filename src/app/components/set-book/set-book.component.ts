import { Component, OnInit, Injectable, OnChanges, Inject, Input, ViewChild } from '@angular/core';
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
import { MatDialog, MAT_DIALOG_DATA, MatFormField, DateAdapter, MatDatepickerInputEvent } from '@angular/material';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { timeInterval, take } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CloseDays } from 'src/app/classes/CloseDays';
import { WorkingHours } from 'src/app/classes/workinghours';
import { SettingsService } from 'src/app/services/settings.service';
import { SettingsEnum } from 'src/app/classes/SettingsEnum';


@Component({
  selector: 'app-set-book',
  templateUrl: './set-book.component.html',
  styleUrls: ['./set-book.component.css'],
})
export class SetBookComponent implements OnInit {
  @Input() localRes:any;
  @ViewChild('select',{static:false}) public ngSelect: NgSelectComponent;

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
  calendarPickerMinDate: Date = addDays(this.dateNow,2);
  maxDate: Date = addDays(this.dateNow, 120);
  formBuilder: any;
  finishStartDate: Date;
  Books: Book;
  MinAfterClose:string;
  LockHour:any;
  WorkDay:WorkingHours;
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
  closeDays:CloseDays[] =[];
  FilterWeekend = (d: Date): boolean => {
    let days;
    if(d.getDate() < 10 && d.getMonth()+1 < 10 ){
      days = d.getFullYear()+"-"+"0"+(d.getMonth()+1)+"-"+"0"+d.getDate()
    }
    else if (d.getMonth()+1 < 10 && d.getDate() > 9 ){
      days = d.getFullYear()+"-"+"0"+(d.getMonth()+1)+"-"+d.getDate()
    }
    else{
      days = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()

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

  constructor(private localres: LocalresService,
              private dialog: MatDialog, 
              private API: ApiServiceService, 
              private settingsService:SettingsService,
              private adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.getAllCloseDays();
    this.getMinAfterClose()
    this.adapter.setLocale('he');
    this.Time$ = this.API.getAllTimes();
    this.Services$ = this.API.getAllServices();
  }

  async getAllCloseDays(){
    this.closeDays = await this.API.getAllCloseDays()
  }

  async getWorkHoursByDay(day){
    this.WorkDay = await this.API.getWorkHoursByDay(day);
  }

  async getLockHoursByDate(date){
    this.LockHour = await this.API.getLockHoursByDate(date);
  }

  async getMinAfterClose() { 
    this.MinAfterClose = await this.settingsService.getSetting(SettingsEnum.MINAFTERWORK);
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
    this.Time$ = this.API.getTimeByDate(this.finishStartDate.getFullYear()+"-"+(this.finishStartDate.getMonth()+1)+"-"+this.finishStartDate.getDate());
    this.getWorkHoursByDay(this.finishStartDate.getDay());
    this.getLockHoursByDate(this.finishStartDate.getFullYear()+"-"+(this.finishStartDate.getMonth()+1)+"-"+this.finishStartDate.getDate());
    
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
    if (!event)
      return;
    if(this.ServcieTypeSelected){
      this.reactiveForm.value.ServcieType = null;
      this.ngSelect.clearModel();
      this.ServcieTypeSelected = null;
    }
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
    if(!event){
      return;
    }
    this.ServcieTypeSelected = event;
    //in this request from server to check all time exist in date choosed
    this.API.TimeExist(this.finishStartDate.getFullYear()+"-"+(this.finishStartDate.getMonth()+1)+"-"+this.finishStartDate.getDate()).subscribe(arry => {
      var timeTotal = this.StartAt + this.ServcieTypeSelected.Duration

      this.notEnoughtime = false;
      for (let i = this.StartAt; i < timeTotal; i++) {
        for (let j = 0; j < arry.Result.length-1; j++) {
          if(arry.Result[j] == i){
            this.notEnoughtime = true;
            this.reactiveForm.value.ServcieType = null;
            this.ServcieTypeSelected = null;
            select.clearModel();
            break;

          }
        }
      }

      //Check if Lock time is end of close time
      if(this.WorkDay.CloseTime <= this.LockHour && timeTotal > this.LockHour){
        this.notEnoughtime = true;
        this.reactiveForm.value.ServcieType = null;
        this.ServcieTypeSelected = null;
        select.clearModel();
        return;
      }

      //check if close time + 120 bigger from time total of app
      else if(this.WorkDay.CloseTime+Number(this.MinAfterClose) < timeTotal){
        this.notEnoughtime = true;
        this.reactiveForm.value.ServcieType = null;
        this.ServcieTypeSelected = null;
        select.clearModel();
        return;
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
      },error =>{
        this.openDialog({message: error.ErrorMessage , type:typeMessage.Error},5000)
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
    this.ServiceSelected = null;
    this.ServcieTypeSelected = null;
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

import { Component, OnInit, Inject, Input } from "@angular/core";
import * as $ from "jquery";
import { Book } from "../../classes/Book";
import { ApiServiceService } from "../../services/api-service.service";
import { take } from "rxjs/operators";
import { CalendarEvent, CalendarView, CalendarEventAction, CalendarEventTimesChangedEvent } from "angular-calendar";
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format
} from "date-fns";
import { Observable, Subject, timer } from "rxjs";
import { Router } from "@angular/router";
import { addDays, addMinutes } from 'date-fns';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DialogContentExampleDialog } from "../set-book/set-book.component";
import { AuthService } from "src/app/services/auth.service";
import { GoogleEvent } from "src/app/classes/GoogleEvents";
import { LocalresService } from 'src/app/services/localres.service';
import { Customer } from 'src/app/classes/Customer';
import { Services } from 'src/app/classes/Services';
import { ServiceTypes } from 'src/app/classes/servicetypes';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CEvent } from 'src/app/classes/CEvent';
import { ActionType } from 'src/app/classes/ActionType';
import { CloseDays } from 'src/app/classes/CloseDays';


export interface DialogData {
  event: CEvent,
  Type?: ActionType,
  localRes: any
}

@Component({
  selector: "app-calendar-view",
  templateUrl: "./calendar-view.component.html",
  styleUrls: ["./calendar-view.component.css"]
})


export class CalendarViewComponent implements OnInit {
  constructor(
    private API: ApiServiceService,
    private router: Router,
    public dialog: MatDialog,
    public auth: AuthService,
    public Localres: LocalresService, public AuthLogin: AuthTokenService) {
    this.AuthLogin.currentUser.subscribe(x => this.currentUser = x);
  }
  events2: CalendarEvent[] = [];
  viewDate: Date = new Date();
  tokenCookie: string = "";
  Books: CEvent[] = [];
  Customers: Customer[] = [];
  Services: Services[] = [];
  ServiceTypes: ServiceTypes[] = [];
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  loading2: boolean = true;
  isEventExist: boolean = false;
  activeDayIsOpen: boolean = false;
  dateNow: Date = new Date(Date.now());
  maxDate: Date = addDays(this.dateNow, 30);
  refresh: Subject<any> = new Subject();
  localRes: any;
  CloseDays: CloseDays[] = [];
  locale: string = 'he';
  @Input() UserGoogle: any;
  BookEditing: Book = new Book();
  lockHours: CEvent[] = [];

  hidetheSer: boolean = false;
  successEvents = [];
  currentUser: any;
  photoGoogle:any;
  ngOnInit() {
    this.auth.auth2().subscribe((res) => {
      if(res){
      this.UserGoogle = res;
      this.photoGoogle = this.UserGoogle.photoURL;
      }
    })
    this.Localres.getLocalResoruce("he").subscribe(res => {
      this.localRes = res;
    })

    this.getApiWithToken();
  }

  async getAllLockHours() {
    this.lockHours = await this.API.getAllLockHours();
  }
  async getAllCloseDays() {
    this.CloseDays = await this.API.getAllCloseDays();
  }

  convertEventToBook(Event: CalendarEvent<Book>): Book {
    let book: Book = {
      BookID: Event.meta.BookID,
      StartAt: Event.meta.StartAt,
      StartDate: Event.meta.StartDate,
      CustomerID: Event.meta.CustomerID,
      Durtion: Event.meta.Durtion,
      ServiceID: Event.meta.ServiceID,
      ServiceTypeID: Event.meta.ServiceTypeID
    }

    return book;
  }
  /**
   * 
   * get API request with check if have token in Query string
   */
  getApiWithToken() {
    this.API.getBooks().subscribe(allbook => {
      this.getAllLockHours();
      this.getAllCloseDays();
      this.Books = allbook.Result;
      timer(1000, 1000).pipe(
        take(1)).subscribe(x => {
          this.getEvent(this.Books);
        })
      // window.history.replaceState({}, document.title, "/#/Admin/Calendar");
    }, error => {
      this.router.navigate(['/Login']);
    })
  }

  clickEvent(Event) {
    var dialogsData: DialogData = {
      event: Event.event,
      localRes: this.localRes
    }

    if (Event.event.meta || Event.event.LockSlot) {
      this.openDialog(dialogsData);
    }
  }

  /**
   * 
   * @param books 
   * 
   * put all the event from array in Calendar UI
   * 
   */
  getEvent(books: CEvent<Book>[]): void {

    //this.events2 = books;
    books.forEach(book => {
      const Event: CEvent<Book> = {
        id: book.meta.BookID,
        title: book.title,
        start: new Date(book.startTime),
        end: new Date(book.endTime),
        serviceType: book.serviceType,
        customer: book.customer,
        meta: book.meta,
        actions: this.actions,
        draggable: true,
        resizable: {
          beforeStart: false,
          afterEnd: false
        },
        color: {
          primary: book.customer.Color,
          secondary: book.customer.Color
        }

      }
      this.events2.push(Event);
      this.refresh.next();
    });


    this.lockHours.forEach(lock => {
      const event: CEvent<any> = {
        title: lock.title,
        start: new Date(lock.startTime),
        end: new Date(lock.endTime),
        allDay: false,
        LockSlot: lock.LockSlot
      }
      this.events2.push(event);
    });

    //Add close day and holiday to calendar
    for (let i = 0; i < this.CloseDays.length; i++) {
      let Start = addMinutes(this.CloseDays[i].Date, 0);
      let End = addMinutes(this.CloseDays[i].Date, 1439);
      const event: CEvent<boolean> = {
        title: 'זמן נעול ' + this.CloseDays[i].Notes,
        start: Start,
        end: End,
        allDay: false,
        meta: false
      }
      this.events2.push(event);

    }
    this.loading2 = false;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {

    event.start = newStart;
    event.end = newEnd;
    var newStartAt = newStart.getHours() * 60 + newStart.getMinutes();
    
    event.meta.StartAt = newStartAt
    this.API.UpdateBook(event.meta).subscribe(res=>{

    });
    this.refresh.next();
  }

  SignInToGoogle() {
    this.auth.login().then(user => {
      this.UserGoogle = user;
    });
  }

  signOut() {
    this.auth.logout();
  }

  getCalendar() {
    this.auth.getCalendar();
  }

  /**
   * Convert array of CalendarEvent to array of GoogleEvent
   * 
   * Get array @param events
   * @returns GoogleEvent[]
   */
  RenderEventToGoogle(events: CalendarEvent[]): GoogleEvent[] {
    let GoogleEvents: GoogleEvent[] = []
    for (let i = 0; i < events.length; i++) {
      let evntgogle: GoogleEvent = {
        calendarId: 'primary',
        summary: events[i].title,
        start: {
          dateTime: events[i].start,
          timeZone: 'Asia/Jerusalem'
        },
        end: {
          dateTime: events[i].end,
          timeZone: 'Asia/Jerusalem'
        },
        description: 'From miritush site ' + events[i].title,
      }
      GoogleEvents.push(evntgogle);
    }
    return GoogleEvents;
  }

  /**
   * 
   * this method sync all event with google calendar
   * 
   * filter all event from today
   * and check if event exist in google calendar
   * 
   * @param events 
   * 
   */
  async SyncAllEvents(events) {
    let allEvent = this.RenderEventToGoogle(events);

    //filter all event from today and more 
    allEvent = allEvent.filter((item: GoogleEvent) =>
      item.start.dateTime.getTime() >= this.dateNow.getTime()
    );

    //get all event from google calendars 
    //need to be auth
    let EventFromGgle = await this.auth.getCalendar();

    //check if event exist in google. if not exist sync with google calendar
    for (let i = 0; i < allEvent.length; i++) {
      this.isEventExist = false;
      for (let j = 0; j < EventFromGgle.length; j++) {
        let datesNew = new Date(EventFromGgle[j].start.dateTime);
        if (datesNew.getTime() == allEvent[i].start.dateTime.getTime()) {
          this.isEventExist = true;
        }

      }
      if (!this.isEventExist) {
        let Results = await this.auth.insertEvent(allEvent[i]);
        if (Results.status == 200) {
          this.successEvents.push(Results);
        }
      }
    }
    if (this.successEvents.length > 0) {
      this.openMessages({ message: this.localRes.SyncSuccess, type: typeMessage.Success }, 3000);
    }
    else {
      this.openMessages({ message: this.localRes.ErrorSync, type: typeMessage.Error }, 3000);

    }

  }



  openDialog(dialogdata: DialogData): void {

    const dialogRef = this.dialog.open(DialogForClickEvent, {
      height: 'auto',
      width: '33%',
      data: dialogdata
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.Type == ActionType.Delete) {
          //this.events2 = result;
          this.events2 = this.events2.filter(Cevent => Cevent !== result.event);
          this.API.DeleteBook(result.event.id, this.tokenCookie).subscribe(data => {
            console.log(data);
          })
        }
        else if (result.Type == ActionType.Edit) {
          this.dialog.open(DialogComponent, {
            data: { localRes: this.localRes, book: result.event.meta }
          });
        }
      }
      this.refresh.next();
    });
    this.refresh.next();
  }

  openMessages(messageObj: MessageConfig, time) {
    this.dialog.open(DialogContentExampleDialog, {
      data: messageObj
    });
    timer(time, 1000).pipe(
      take(1)).subscribe(x => {
        this.dialog.closeAll();
      })
  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="far fa-edit"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.BookEditing =  event.meta//this.convertEventToBook(event);
        this.hidetheSer = true;
        this.dialog.open(DialogComponent, {
          data: { localRes: this.localRes, book: this.BookEditing }
        });
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.API.DeleteBook(event.id, this.tokenCookie).subscribe(data => {
          if (data.Result) {
            this.events2 = this.events2.filter(iEvent => iEvent !== event);
          }
        })
      }
    }
  ];

}

@Component({
  selector: 'dialog-for-click-event',
  templateUrl: 'dialog-event.component-dialog.html',
  styleUrls: ["./calendar-view.component.css"]
})
export class DialogForClickEvent {
  //get MessageResult() { return ; }
  newStart: string;
  newEnd: string;
  localRes: any = {}
  newEvents: CalendarEvent[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<DialogForClickEvent>) {
    this.newStart = data.event.start.toLocaleTimeString();
    if (data.event.meta) {
      this.newEnd = data.event.meta.StartAt + data.event.meta.Durtion;
    }
  }

  deleteEvent() {
    //this.newEvents = this.data.events.filter(Ievent => Ievent !== this.data.event);
    this.data.Type = ActionType.Delete;
    this.dialogRef.close(this.data);

  }

  editEvent() {
    this.data.Type = ActionType.Edit;
    this.dialogRef.close(this.data);
  }
}

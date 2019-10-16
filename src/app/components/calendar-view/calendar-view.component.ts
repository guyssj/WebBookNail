import { Component, OnInit, Inject, Input } from "@angular/core";
import * as $ from "jquery";
import "fullcalendar";
import { Book } from "../../classes/Book";
import { ApiServiceService } from "../../services/api-service.service";
import { map, take } from "rxjs/operators";
import { CalendarEvent, CalendarView, CalendarEventAction } from "angular-calendar";
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
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
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

const timezoneOffset = new Date().getTimezoneOffset();
const hoursOffset = String(Math.floor(Math.abs(timezoneOffset / 60))).padStart(
  2,
  "0"
);

const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, "0");
const direction = timezoneOffset > 0 ? "-" : "+";
const timezoneOffsetString = `T00:00:00${direction}${hoursOffset}${minutesOffset}`;

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export interface DialogData {
  event: CalendarEvent,
  events: CalendarEvent[]
}

@Component({
  selector: "app-calendar-view",
  templateUrl: "./calendar-view.component.html",
  styleUrls: ["./calendar-view.component.css"]
})


export class CalendarViewComponent implements OnInit {
  constructor(
    private API: ApiServiceService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public auth: AuthService,
    public Localres: LocalresService) { }
  events2: CalendarEvent[] = [];
  viewDate: Date = new Date();
  tokenCookie: string = "";
  Books: Book[] = [];
  Customers: Customer[] = [];
  Services: Services[] = [];
  ServiceTypes: ServiceTypes[] = [];
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  loading2: boolean = true;
  isEventExist: boolean = false;
  activeDayIsOpen: boolean = false;
  dateNow: Date = new Date(Date.now());
  maxDate: Date = addDays(this.dateNow, 30);
  refresh: Subject<any> = new Subject();
  localRes: any;
  locale: string = 'he';
  @Input() UserGoogle:any;
  BookEditing: Book = new Book();
  hidetheSer: boolean = false;
  successEvents = [];
  ngOnInit() {
    this.auth.auth2().subscribe((res) => {
      this.UserGoogle = res;
    })
    this.Localres.getLocalResoruce("he").subscribe(res => {
      this.localRes = res;
    })
    this.getApiWithToken();
  }

  async getAllCustomers() {
    this.Customers = await this.API.GetAllCustomers();
  }

  async getAllServiceTypes() {
    this.ServiceTypes = await this.API.getAllServiceTypes();
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
    this.route
      .queryParams
      .subscribe(params => {
        debugger;
        //check if cookie token is exist
        this.tokenCookie = getCookie("userToken");
        if (this.tokenCookie != "") {
          let GetToken = params["TokenApi"];
          // check if have token API in Query string
          if (GetToken != undefined) {
            // update the Cookie token
            setCookie("userToken", GetToken, 1)
            this.API.getBooks().subscribe(allbook => {
              this.getAllCustomers();
              this.getAllServiceTypes();
              this.Books = allbook.Result;
              timer(3000, 1000).pipe(
                take(1)).subscribe(x => {
                  this.getEvent(this.Books);
                })
              window.history.replaceState({}, document.title, "/#/Admin/Calendar");
            })
          }
          else {
            //Get all books from API with Token
            this.API.getBooks().subscribe(allbook => {
              this.getAllCustomers();
              this.getAllServiceTypes()
              this.Books = allbook.Result;
              timer(3000, 1000).pipe(
                take(1)).subscribe(x => {
                  this.getEvent(this.Books);
                })
            })
          }
        }
        else {
          //Get all books from api with token
          let GetToken = params["TokenApi"];
          if (GetToken != undefined) {
            setCookie("userToken", GetToken, 1)
            this.API.getBooks().subscribe(allbook => {
              this.getAllCustomers();
              this.getAllServiceTypes();
              this.Books = allbook.Result;
              timer(3000, 1000).pipe(
                take(1)).subscribe(x => {
                  this.getEvent(this.Books);
                })
            })
          }
          else {
            this.router.navigate(['/Login']);
          }
        }
      });
  }

  clickEvent(Event) {
    console.log(Event.event);
    var dialogsData: DialogData = {
      event: Event.event,
      events: this.events2
    }

    this.openDialog(dialogsData);
  }

  /**
   * 
   * @param books 
   * 
   * put all the event from array in Calendar UI
   * 
   */
  getEvent(books: Book[]): void {
    for (let i = 0; i < books.length; i++) {
      let FilterServiceType = this.ServiceTypes.find(servFilter => servFilter.ServiceTypeID == books[i].ServiceTypeID);
      let cus = this.Customers.find(cus => cus.CustomerID == books[i].CustomerID)
      let Start = addMinutes(books[i].StartDate, books[i].StartAt);
      let End = addMinutes(Start, books[i].Durtion);
      const event: CalendarEvent<Book> = {
        id: books[i].BookID,
        title: cus.FirstName + ' ' + cus.LastName + ' - ' + FilterServiceType.ServiceTypeName,
        start: Start,
        end: End,
        meta: books[i],
        actions: this.actions,
        draggable: false,
        resizable: {
          beforeStart: false,
          afterEnd: false
        }
      }
      this.events2.push(event);
      this.refresh.next();


    } //end of loop for
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

  SignInToGoogle() {
    this.auth.login().then(user => {
      console.log(user);

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
      data: dialogdata
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.events2 = result;
        this.API.DeleteBook(dialogdata.event.id, this.tokenCookie).subscribe(data => {
          console.log(data);
        })
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
        debugger;
        this.BookEditing = this.convertEventToBook(event);
        this.hidetheSer = true;
        document.getElementById('edit2').click();
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
})
export class DialogForClickEvent {
  //get MessageResult() { return ; }
  newStart: string;
  newEnd: string;
  localRes: any = {}
  newEvents: CalendarEvent[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private localres: LocalresService, public dialogRef: MatDialogRef<DialogForClickEvent>) {
    this.newStart = data.event.start.toLocaleTimeString();
    this.newEnd = data.event.end.toLocaleTimeString();
    this.localres.getLocalResoruce("he").subscribe(res => {
      this.localRes = res;
    });
  }

  deleteEvent(event) {
    this.newEvents = this.data.events.filter(Ievent => Ievent !== this.data.event);
    this.dialogRef.close(this.newEvents);

  }



}

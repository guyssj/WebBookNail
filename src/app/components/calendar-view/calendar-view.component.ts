import { Component, OnInit, Inject } from "@angular/core";
import * as $ from "jquery";
import "fullcalendar";
import { Book } from "../../Book";
import { ApiServiceService } from "../../api-service.service";
import { map } from "rxjs/operators";
import { CalendarEvent, CalendarView } from "angular-calendar";
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
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { addDays, addMinutes } from 'date-fns';
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { DialogContentExampleDialog } from "../set-book/set-book.component";
import { AuthService } from "src/app/auth.service";
import { GoogleEvent } from "src/app/GoogleEvents";

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
    public auth: AuthService) { }
  events2: CalendarEvent[] = [];
  viewDate: Date = new Date();
  tokenCookie: string = "";
  Books: Book[] = [];
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  loading2: boolean = true;
  isEventExist: boolean = false;
  activeDayIsOpen: boolean = false;
  dateNow: Date = new Date(Date.now());
  maxDate: Date = addDays(this.dateNow, 30);
  refresh: Subject<any> = new Subject();
  locale: string = 'he';
  UserGoogle:any;
  ngOnInit() {
    this.getApiWithToken();
  }

  /**
   * 
   * get API request with check if have token in Query string
   */
  getApiWithToken() {
    this.route
      .queryParams
      .subscribe(params => {
        //check if cookie token is exist
        this.tokenCookie = getCookie("userToken");
        if (this.tokenCookie != "") {
          let GetToken = params["TokenApi"];
          // check if have token API in Query string
          if (GetToken != undefined) {
            // update the Cookie token
            setCookie("userToken", GetToken, 1)
            this.API.getBooks().subscribe(allbook => {
              this.Books = allbook.Result;
              this.getEvent(this.Books);
              window.history.replaceState({}, document.title, "/#/" + "Calendar");
            })
          }
          else {
            //Get all books from API with Token
            this.API.getBooks().subscribe(allbook => {
              this.Books = allbook.Result;
              this.getEvent(this.Books);
            })
          }
        }
        else {
          //Get all books from api with token
          let GetToken = params["TokenApi"];
          if (GetToken != undefined) {
            setCookie("userToken", GetToken, 1)
            this.API.getBooks().subscribe(allbook => {
              this.Books = allbook.Result;
              this.getEvent(this.Books);
            })
          }
          else {
            this.router.navigate(['/Admin']);
          }
        }
      });
  }

  clickEvent(Event) {
    console.log(Event.event);
    this.dialog.open(DialogForClickEvent, {
      data: Event.event
    });
  }

  /**
   * 
   * @param books 
   * 
   * put all the event from array in Calendar UI
   * 
   */
  getEvent(books: Book[]): void {
    // fill all ecent to array EventCalendar Angular 6 calendar
    for (let i = 0; i < books.length; i++) {
      this.API.getCustomerById(books[i].CustomerID).subscribe(cus => {
        this.API.getAllServicetypesByServiceID(books[i].ServiceID).subscribe(srvtype => {
          let servType = srvtype.Result.find(serv => serv.ServiceTypeId == books[i].ServiceTypeID)
          let Start = addMinutes(books[i].StartDate, books[i].StartAt);
          let End = addMinutes(Start, books[i].Durtion);
          const event = {
            title: cus.Result.FirstName + ' ' + cus.Result.LastName + ' - ' + servType.ServiceTypeName,
            start: Start,
            end: End,
            draggable: false,
            resizable: {
              beforeStart: false,
              afterEnd: false
            }
          }
          this.events2.push(event);
          this.refresh.next();
        });
      }); //end customer

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
    let GoogleEvents:GoogleEvent[] = []
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
        await this.auth.insertEvent(allEvent[i]);
      }
    }
  }


}

@Component({
  selector: 'dialog-for-click-event',
  templateUrl: 'dialog-event.component-dialog.html',
})
export class DialogForClickEvent {
  //get MessageResult() { return ; }
  constructor(@Inject(MAT_DIALOG_DATA) public data: CalendarEvent) {

  }

}

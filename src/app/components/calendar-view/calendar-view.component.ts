import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import "fullcalendar";
import { Book } from "../../Book";
import { ApiServiceService } from "../../api-service.service";
import { map } from "rxjs/operators";
import { CalendarEvent } from "angular-calendar";
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
import { HttpClient, HttpParams } from "@angular/common/http";
import { removeSummaryDuplicates } from "../../../../node_modules/@angular/compiler";

interface bookz {
  BookID: number;
  StartDate: string;
  EndDate: any;
}
const timezoneOffset = new Date().getTimezoneOffset();
const hoursOffset = String(Math.floor(Math.abs(timezoneOffset / 60))).padStart(
  2,
  "0"
);
const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, "0");
const direction = timezoneOffset > 0 ? "-" : "+";
const timezoneOffsetString = `T00:00:00${direction}${hoursOffset}${minutesOffset}`;

@Component({
  selector: "app-calendar-view",
  templateUrl: "./calendar-view.component.html",
  styleUrls: ["./calendar-view.component.css"]
})
export class CalendarViewComponent implements OnInit {
  constructor(private API: ApiServiceService, private http: HttpClient) { }
  events2: CalendarEvent[] = [];
  viewDate: Date = new Date();
  Books: Book[]= [];
  view: string = "month";
  events$: Observable<Array<CalendarEvent<{ bookz: bookz }>>>;
  activeDayIsOpen: boolean = false;
  refresh: Subject<any> = new Subject();
  locale: string = 'he';
  ngOnInit() {
    this.API.getBooks().subscribe(allbook => {
      debugger;
      this.Books = allbook.Result;
      this.getEvent(this.Books);
    })
    //this.fetchEvents2();
    // fill all event to array fixed to ui-calendar
    // for (let i = 0; i < books.length; i++) {
    //   let event = {
    //     title:'ok '+i,
    //     start:'',
    //     end:''
    //   }
    //   event.start = books[i].StartDate;
    //   event.end = books[i].EndDate;
    //   this.events2.push(event);
    // }
    // this.getCalendar(this.events2);
    // });
  }

  addEvent(): void {
    debugger;
    this.events2.push({
      title: 'New event',
      start: new Date("2018-10-19"),
      end: new Date("2018-10-19"),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }

  fetchEvents2(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];
    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];
    this.events$ = this.http
      .get("http://localhost/NailAPI/public/api/GetAllBook")
      .pipe(
        map(({ results }: { results: bookz[] }) => {
          debugger;
          return results.map((bookz: bookz) => {
            return {
              title: bookz.BookID.toString(),
              start: new Date(bookz.StartDate),
              meta: {
                bookz
              }
            };
          });
        })
      );
  }

  /**
   * 
   * @param books 
   * 
   * put all the event from array in Calendar UI
   * 
   */
  getEvent(books:Book[]): void {
    // this.Books = this.getBooks();
    debugger;
    // fill all ecent to array EventCalendar Angular 6 calendar
    for (let i = 0; i < books.length; i++) {
      const event = {
        title: books[i].BookID.toString()+(i+1),
        start: new Date(books[i].StartDate),
        end: new Date(books[i].EndDate),
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
      this.events2.push(event);
      this.refresh.next();      
    }
  }
}

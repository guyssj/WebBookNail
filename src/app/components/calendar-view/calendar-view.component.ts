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
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

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
  constructor(private API: ApiServiceService, private http: HttpClient, private route: ActivatedRoute) { }
  events2: CalendarEvent[] = [];
  viewDate: Date = new Date();
  tokenCookie: string = "";
  Books: Book[] = [];
  view: string = "week";
  loading2:boolean = true;
  events$: Observable<Array<CalendarEvent<{ bookz: bookz }>>>;
  activeDayIsOpen: boolean = false;
  refresh: Subject<any> = new Subject();
  locale: string = 'he';
  ngOnInit() {
    this.getApiWithToken();
  }
/**
 * 
 * get API request with check if have token in Query string
 */
  getApiWithToken(){
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
              debugger;
              this.Books = allbook.Result;
              this.getEvent(this.Books);
              this.loading2 = false;
            })
          }
          else{
            //Get all books from API with Token
            this.API.getBooks().subscribe(allbook => {
              debugger;
              this.Books = allbook.Result;
              this.getEvent(this.Books);
              this.loading2 = false;
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
              this.loading2 = false;
            })
          }
        }
      });
  }

  clickEvent(event){
    console.log(event);
  }
  addEvent(): void {
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
  getEvent(books: Book[]): void {
    // fill all ecent to array EventCalendar Angular 6 calendar
    for (let i = 0; i < books.length; i++) {
      this.API.getCustomerById(books[i].CustomerID).subscribe(cus =>{
        const event = {
          title: cus.Result.FirstName +' '+ cus.Result.LastName ,
          start: new Date(books[i].StartDate),
          end: new Date(books[i].EndDate),
          draggable: false,
          resizable: {
            beforeStart: false,
            afterEnd: false
          }
        }
        this.events2.push(event);
        this.refresh.next();
      });

    }
  }
}

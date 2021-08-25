import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Book } from '../classes/Book';
import { Observable } from 'rxjs';
import { resultsAPI } from '../classes/results'
import { date } from '../classes/date';
import { TimeSlots } from '../classes/TimeSlots';
import { Services } from '../classes/Services';
import { ServiceTypes } from '../classes/servicetypes';
import { Customer } from '../classes/Customer';
import { CalendarEvent } from 'angular-calendar';
import { addMinutes } from 'date-fns';
import { environment } from 'src/environments/environment';
import { CloseDays } from '../classes/CloseDays';
import { WorkingHours } from '../classes/workinghours';
import { LockHours } from '../classes/LockHours';
import { CEvent } from '../classes/CEvent';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpClient) { }

  getAllTimes(): Observable<TimeSlots[]> {
    return this.http.get<TimeSlots[]>(`${environment.apiUrl}api/GetTimeSlots`);
  }
  getTimeByDate(date, Duration = 0): Observable<TimeSlots[]> {
    return this.http.get<TimeSlots[]>(`${environment.apiUrl}api/GetTimeSlots?Date=${date}&Duration=${Duration}`);
  }

  async getWorkHoursByDay(day) {
    let workday = await this.http.get<resultsAPI<WorkingHours>>(`${environment.apiUrl}api/GetWorkHoursByDay?dayOfWeek=${day}`, { withCredentials: true }).toPromise();
    return workday.Result;
  }

  getCookie(cname) {
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

}

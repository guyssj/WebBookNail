import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from './Book';
import { Observable } from '../../node_modules/rxjs';
import { CalendarEvent } from '../../node_modules/calendar-utils';
import {resultsAPI} from './results'
import { date } from './date';
import { TimeSlots } from './TimeSlots';
import { Services } from './Services';
import { ServiceTypes } from './servicetypes';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  // tslint:disable-next-line:no-inferrable-types
  _baseUrl: string = 'http://localhost/NailAPI/public/api/';
  constructor(private http: HttpClient) { }

  getBooks() {
    return this.http.get<resultsAPI<Book[]>>(this._baseUrl + 'GetAllBook2');
  }

  getAllDates():Observable<date[]>{
    return this.http.get<date[]>(this._baseUrl+'GetAllDates')
  }

  getAllTimes():Observable<TimeSlots[]>{
    return this.http.get<TimeSlots[]>(this._baseUrl+'GetTimeSlots')
  }

  getAllServices():Observable<Services[]>{
    return this.http.get<Services[]>(this._baseUrl+'GetAllServices')
  }

  getAllServicetypesByServiceID(id):Observable<ServiceTypes[]>{
    return this.http.get<ServiceTypes[]>(this._baseUrl+'GetAllServiceTypeByService?ServiceID='+id)
  }

  setBook(Book:Book){
    return this.http.post(this._baseUrl+'SetBook',Book)
  }

}

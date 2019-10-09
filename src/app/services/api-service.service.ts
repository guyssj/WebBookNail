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

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  _baseUrl: string = 'http://localhost/NailBook/public/api/';
  _baseUrl2: string = 'http://localhost/NailBook/public/admin/';
  constructor(private http: HttpClient) { }


  login(obj) {
    return this.http.post("http://localhost/NailBook/public/login", obj, { observe: 'response' });
  }

  addCustomer(customer: Customer): Observable<resultsAPI<number>> {
    return this.http.post<resultsAPI<number>>(this._baseUrl + 'AddCustomer', customer);
  }

  getBooks() {
    return this.http.get<resultsAPI<Book[]>>(this._baseUrl2 + 'GetAllBook2', { withCredentials: true });
  }

  getAllTimes(): Observable<TimeSlots[]> {
    return this.http.get<TimeSlots[]>(this._baseUrl + 'GetTimeSlots')
  }
  getTimeByDate(date): Observable<TimeSlots[]> {
    return this.http.get<TimeSlots[]>(this._baseUrl + 'GetTimeSlots?Date=' + date)
  }
  TimeExist(date): Observable<resultsAPI<any[]>> {
    return this.http.get<resultsAPI<any[]>>(this._baseUrl + 'GetSlotsExist?Date=' + date)
  }
  getAllServices(): Observable<Services[]> {
    return this.http.get<Services[]>(this._baseUrl + 'GetAllServices')
  }

  getAllServicetypesByServiceID(id) {
    return this.http.get<resultsAPI<ServiceTypes[]>>(this._baseUrl + 'GetAllServiceTypeByService?ServiceID=' + id)
  }

  async getAllServiceTypes() {
    let ServiceTypes = await this.http.get<resultsAPI<ServiceTypes[]>>(this._baseUrl + 'GetAllServiceTypes').toPromise()
    return ServiceTypes.Result;
  }

  async GetAllCustomers() {
    let customers = await this.http.get<resultsAPI<Customer[]>>(this._baseUrl2 + 'GetAllCustomers', { withCredentials: true }).toPromise();
    return customers.Result;
  }

  getCustomerById(id) {
    return this.http.get<resultsAPI<Customer>>(this._baseUrl + 'GetCustomerById?CustomerID=' + id, { withCredentials: true });
  }

  setBook(Book: Book): Observable<resultsAPI<any>> {
    return this.http.post<resultsAPI<any>>(this._baseUrl + 'SetBook', Book);
  }

  GetCustomerByPhone(customerPhone) {
    return this.http.get<resultsAPI<Customer>>(this._baseUrl + 'GetCustomerByPhone?PhoneNumber=' + customerPhone);
  }

  GetBookByCustomer(Customer: Customer) {
    return this.http.get<resultsAPI<Book>>(this._baseUrl + 'GetBookByCustomer?CustomerID=' + Customer.CustomerID);
  }

  UpdateBook(Book: Book): Observable<resultsAPI<any>> {
    return this.http.put<resultsAPI<any>>(this._baseUrl + 'UpdateBook', Book);

  }

  DeleteBook(id: any, token): Observable<resultsAPI<any>> {
    let headers = new HttpHeaders();
    //headers = headers.append('Authorization', this.authKey);
    headers = headers.append('X-Token', token);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post<resultsAPI<any>>(this._baseUrl2 + 'DeleteBook', { id: id }, { headers, withCredentials: true });

  }

}

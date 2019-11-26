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

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpClient) { }

  addCustomer(customer: Customer): Observable<resultsAPI<number>> {
    return this.http.post<resultsAPI<number>>(`${environment.apiUrl}api/AddCustomer`, customer);
  }

  getBooks() {
    return this.http.get<resultsAPI<Book[]>>(`${environment.apiUrl}admin/GetAllBook2`, { withCredentials: true });
  }

  getAllTimes(): Observable<TimeSlots[]> {
    return this.http.get<TimeSlots[]>(`${environment.apiUrl}api/GetTimeSlots`)
  }
  getTimeByDate(date): Observable<TimeSlots[]> {
    return this.http.get<TimeSlots[]>(`${environment.apiUrl}api/GetTimeSlots?Date=${date}`)
  }
  TimeExist(date): Observable<resultsAPI<any[]>> {
    return this.http.get<resultsAPI<any[]>>(`${environment.apiUrl}api/GetSlotsExist?Date=${date}`)
  }
  getAllServices(): Observable<Services[]> {
    return this.http.get<Services[]>(`${environment.apiUrl}api/GetAllServices`)
  }

  getAllServicetypesByServiceID(id) {
    return this.http.get<resultsAPI<ServiceTypes[]>>(`${environment.apiUrl}api/GetAllServiceTypeByService?ServiceID=${id}`)
  }

  async getAllServiceTypes() {
    let ServiceTypes = await this.http.get<resultsAPI<ServiceTypes[]>>(`${environment.apiUrl}api/GetAllServiceTypes`).toPromise()
    return ServiceTypes.Result;
  }

  async GetAllCustomers() {
    let customers = await this.http.get<resultsAPI<Customer[]>>(`${environment.apiUrl}admin/GetAllCustomers`, { withCredentials: true }).toPromise();
    return customers.Result;
  }


  async getAllCloseDays() {
    let CloseDays = await this.http.get<resultsAPI<CloseDays[]>>(`${environment.apiUrl}api/GetDateClosed`).toPromise();
    return CloseDays.Result;
  }

  getCustomerById(id) {
    return this.http.get<resultsAPI<Customer>>(`${environment.apiUrl}api/GetCustomerById?CustomerID=${id}`, { withCredentials: true });
  }

  setBook(Book: Book): Observable<resultsAPI<any>> {
    return this.http.post<resultsAPI<any>>(`${environment.apiUrl}api/SetBook`, Book);
  }

  GetCustomerByPhone(customerPhone) {
    return this.http.get<resultsAPI<Customer>>(`${environment.apiUrl}api/GetCustomerByPhone?PhoneNumber=${customerPhone}`);
  }

  GetBookByCustomer(Customer: Customer) {
    debugger;
    return this.http.get<resultsAPI<Book>>(`${environment.apiUrl}api/GetBookByCustomer?CustomerID=${Customer[0].CustomerID}`);
  }

  UpdateBook(Book: Book): Observable<resultsAPI<any>> {
    return this.http.put<resultsAPI<any>>(`${environment.apiUrl}api/UpdateBook`, Book,{withCredentials:true});
  }

  DeleteBook(id: any, token): Observable<resultsAPI<any>> {
    let headers = new HttpHeaders();
    //headers = headers.append('Authorization', this.authKey);
    headers = headers.append('X-Token', token);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post<resultsAPI<any>>(`${environment.apiUrl}admin/DeleteBook`, { id: id }, { headers, withCredentials: true });

  }

  addServiceType(serviceType):Observable<resultsAPI<any>>{
    return this.http.post<resultsAPI<any>>(`${environment.apiUrl}api/AddServiceType`,serviceType,{withCredentials:true});
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

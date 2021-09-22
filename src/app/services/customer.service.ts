import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../classes/Customer';
import { resultsAPI } from '../classes/results';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  addCustomer(customer: Customer): Observable<resultsAPI<number>> {
    return this.http.post<resultsAPI<number>>(`${environment.apiUrl}api/Customer/AddCustomer`, customer);
  }
  generateOTP(phoneNumber) {
    return this.http.get<resultsAPI<boolean>>(`${environment.apiUrl}api/Customer/GenerateToken?PhoneNumber=${phoneNumber}`)
  }
  async GetAllCustomers() {
    let customers = await this.http.get<resultsAPI<Customer[]>>(`${environment.apiUrl}admin/Customer/GetAll`, { withCredentials: true }).toPromise();
    return customers.Result;
  }
  getCustomerById(id) {
    return this.http.get<resultsAPI<Customer>>(`${environment.apiUrl}admin/Customer/GetCustomerById?CustomerID=${id}`, { withCredentials: true });
  }
  GetCustomerByPhone() {
    return this.http.get<resultsAPI<Customer>>(`${environment.apiUrl}api/Customer/GetCustomerByPhone`);
  }
}

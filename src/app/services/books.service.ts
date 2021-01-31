import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book } from '../classes/Book';
import { CEvent } from '../classes/CEvent';
import { resultsAPI } from '../classes/results';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  getBooks() {
    return this.http.get<resultsAPI<CEvent<Book>[]>>(`${environment.apiUrl}admin/Book/GetAll`, { withCredentials: true });
  }
  setBook(Book: Book): Observable<resultsAPI<any>> {
    return this.http.post<resultsAPI<any>>(`${environment.apiUrl}api/Book/SetBook`, Book);
  }

  GetBooksByCustomerPhone() {
    return this.http.get<resultsAPI<Book[]>>(`${environment.apiUrl}api/Book/GetBooksByCustomer`,{ withCredentials: true });
  }

  UpdateBook(Book: Book): Observable<resultsAPI<any>> {
    return this.http.put<resultsAPI<any>>(`${environment.apiUrl}api/Book/UpdateBook`, Book,{withCredentials:true});
  }

  DeleteBook(id: any): Observable<resultsAPI<any>> {
    return this.http.delete<resultsAPI<any>>(`${environment.apiUrl}admin/Book/DeleteBook/${id}`);

  }
}

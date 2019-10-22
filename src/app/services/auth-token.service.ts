import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { resultsAPI } from '../classes/results';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('userToken')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(obj) {
    return this.http.post(`${environment.apiUrl}/login`, obj)
      .pipe(map<resultsAPI<any>,object>(user => {
        localStorage.setItem('userToken', JSON.stringify(user.Result));
        this.currentUserSubject.next(user.Result);
        return user.Result;
      }));
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
}

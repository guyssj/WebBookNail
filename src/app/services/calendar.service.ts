import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CEvent } from '../classes/CEvent';
import { CloseDays } from '../classes/CloseDays';
import { resultsAPI } from '../classes/results';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http:HttpClient) { }

  async getAllCloseDays() {
    let CloseDays = await this.http.get<resultsAPI<CloseDays[]>>(`${environment.apiUrl}api/Calendar/GetHolidayClosed`).toPromise();
    return CloseDays.Result;
  }
  
  async getAllLockHours(){
    let LockHours = await this.http.get<resultsAPI<CEvent[]>>(`${environment.apiUrl}admin/Calendar/GetAllLockHours`).toPromise();
    return LockHours.Result;
  }


  async getLockHoursByDate(date){
    let LockHours = await this.http.get<resultsAPI<any>>(`${environment.apiUrl}api/Calendar/GetLockHoursByDate?Date=${date}`,{withCredentials:true}).toPromise();
    return LockHours.Result;
  }

  TimeExist(date): Observable<resultsAPI<any[]>> {
    return this.http.get<resultsAPI<any[]>>(`${environment.apiUrl}api/Calendar/GetSlotsExist?Date=${date}`)
  }
}

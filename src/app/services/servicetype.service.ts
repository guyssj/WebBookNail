import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { resultsAPI } from '../classes/results';
import { Services } from '../classes/Services';
import { ServiceTypes } from '../classes/servicetypes';

@Injectable({
  providedIn: 'root'
})
export class ServicetypeService {

  constructor(private http:HttpClient) { }

  getAllServices(): Observable<resultsAPI<Services[]>> {
    return this.http.get<resultsAPI<Services[]>>(`${environment.apiUrl}api/Service/GetAll`)
  }

  getAllServicetypesByServiceID(id) {
    return this.http.get<resultsAPI<ServiceTypes[]>>(`${environment.apiUrl}api/Service/ServiceTypeByService?ServiceID=${id}`)
  }
  async getAllServiceTypes() {
    let ServiceTypes = await this.http.get<resultsAPI<ServiceTypes[]>>(`${environment.apiUrl}api/Service/GetAllServiceTypes`).toPromise()
    return ServiceTypes.Result;
  }
  addServiceType(serviceType):Observable<resultsAPI<any>>{
    return this.http.post<resultsAPI<any>>(`${environment.apiUrl}admin/Service/AddServiceType`,serviceType,{withCredentials:true});
  }
}

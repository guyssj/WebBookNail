import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalresService {

  constructor(public httpClient:HttpClient) { }

  getLocalResoruce(Lang){
    return this.httpClient.get("/assets/"+Lang+".json")
  }
}

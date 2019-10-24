import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../classes/StoreSettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http:HttpClient) { }

  getSettings():Observable<Settings>{
    return this.http.get<Settings>("/assets/storeSettings.json");
  }
  saveSettings(){

  }
}

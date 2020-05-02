import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../classes/StoreSettings';
import { Observable } from 'rxjs';
import { SettingsEnum } from '../classes/SettingsEnum';
import { environment } from 'src/environments/environment';
import { resultsAPI } from '../classes/results';
import { SettingObj } from '../classes/Settings';

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

  async getSetting(settingName:SettingsEnum){
    let settings = await this.http.get<resultsAPI<SettingObj>>(`${environment.apiUrl}api/GetSetting?SettingName=${settingName}`).toPromise()
    return settings.Result.SettingValue;
  }
}

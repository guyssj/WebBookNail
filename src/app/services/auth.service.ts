import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { auth } from 'firebase/app';

import { HttpClient } from '@angular/common/http';
import { GoogleEvent } from '../classes/GoogleEvents';
const hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60 ).toISOString();

declare var gapi;
@Injectable({
  providedIn: 'root'
})


export class AuthService {

  user$: Observable<firebase.User>;
  calendarItems: any[];

  constructor(public afAuth: AngularFireAuth, public http: HttpClient) {
    this.initClient();
  }

  initClient() {
    gapi.load('client', () => {
      console.log('Loaded client');
      gapi.client.init({
        apiKey: 'AIzaSyA7HzWhPVRF7dNjWuTV8h4es6H3m_pyPoM',
        clientId: '107195644423-o9vujm4pei3dv7goll3e6955j7gdo91e.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      });
      gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'))

    });

  }

  

  async login() {
    console.log(gapi.client);
    const googleAuth = gapi.auth2.getAuthInstance();
    console.log(googleAuth);
    const googleUser = await googleAuth.signIn();
    const token = googleUser.getAuthResponse().id_token;
    // Alternative approach, use the Firebase login with scopes and make RESTful API calls

    const provider = new auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/calendar');

    this.afAuth.auth.signInWithPopup(provider)

    return this.afAuth.auth.currentUser;
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  authState(){
    this.afAuth.authState.subscribe((res) => {
      console.log(res.displayName);
      return res;
    })
  }

  auth2(){
    return this.afAuth.authState;
  }

  async getCalendar() {
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 30,
      orderBy: 'startTime'
    })
     this.calendarItems = events.result.items;
     return this.calendarItems
  }

  async insertEvent(Event:GoogleEvent) {
    const insert = await gapi.client.calendar.events.insert(Event);

    return insert;
  }  
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { HttpClient } from '../../node_modules/@angular/common/http';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User>;
  calendarItems: any[];

  constructor(public afAuth: AngularFireAuth, public http: HttpClient) {
    this.initClient();
    this.user$ = afAuth.authState;
  }
  // loadClient() {
  //   gapi.client.setApiKey("AIzaSyA7HzWhPVRF7dNjWuTV8h4es6H3m_pyPoM");
  //   return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
  //     .then(function () { console.log("GAPI client loaded for API"); },
  //       function (err) { console.error("Error loading GAPI client for API", err); });
  // }

  initClient() {
    gapi.load('client', () => {
      console.log('Loaded client');
      gapi.client.init({
        apiKey: 'AIzaSyC3Wn-g15Q6kDaTKyVZGdrRuDDtnhmHYZI',
        clientId: '565956861788-8pj575ea8lvq97ecvk5fr0g8g1v4qkd7.apps.googleusercontent.com',
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
    const credential = auth.GoogleAuthProvider.credential(token);
    debugger;
    await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);

  }

  logout() {
    this.afAuth.auth.signOut();
  }

  async getCalendar() {
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    })
    console.log(events);

    this.calendarItems = events.result.items;
  }
}

import { Injectable, Inject } from '@angular/core';
import { GtagConfig, GtagPageview } from '../classes/GAInterface';
declare let gtag:Function;
@Injectable({
  providedIn: 'root'
})

export class GoogleAnalyticsService {
  private mergedConfig: GtagConfig = {
    trackingId: "UA-170178289-1"
  };

  constructor() {
   }

  public eventEmitter( 
    eventName: string, 
    eventCategory: string, 
    eventAction: string, 
    eventLabel: string = null,  
    eventValue: number = null ){ 
         gtag('event', eventName, { 
                 eventCategory: eventCategory, 
                 eventLabel: eventLabel, 
                 eventAction: eventAction, 
                 eventValue: eventValue
               })
    }
    pageview(params?: GtagPageview) {

      try {
        const defaults = {
          page_path: '/',
          page_title: ' מיריתוש | טיפוח הציפורן | קביעת תורים',
          page_location: window.location.href
        };
  
        params = { ...defaults, ...params };
        gtag('config', this.mergedConfig.trackingId, params);
      } catch (err) {
        console.error('Google Analytics pageview error', err);
      }
    }
}

export class GoogleEvent{
    calendarId: string;
    start: {
      dateTime: Date;
      timeZone:string;
    };
    end: {
      dateTime: Date,
      timeZone: string;
    }; 
    summary:string;
    description: string;

    /**
     *
     */
    constructor() {

    }
    
    
}
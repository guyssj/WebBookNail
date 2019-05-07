export interface CalendarEvent<MetaType = any> {
    start: any;
    end?: any;
    title: string;
    color?: EventColor;
    actions?: EventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
      beforeStart?: boolean;
      afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: MetaType;
  }
  export interface EventColor {
    primary: string;
    secondary: string;
  }

  export interface EventAction {
    label: string;
    cssClass?: string;
    onClick({event}: {event: CalendarEvent}): any;
  }

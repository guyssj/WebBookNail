import { EventColor, EventAction } from '../calendarutil';
import { Customer } from './Customer';
import { ServiceTypes } from './servicetypes';
import { LockHours } from './LockHours';

export interface CEvent<MetaType = any> {
    id?: string | number;
    start: Date;
    end?: Date;
    startTime?: Date;
    endTime?: Date;
    title: string;
    customer?:Customer;
    serviceType?:ServiceTypes,
    LockSlot?:LockHours;
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
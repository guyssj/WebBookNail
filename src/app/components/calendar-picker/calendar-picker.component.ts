import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { addDays, addMinutes, addMonths, getMonth } from 'date-fns';
import { CalendarDay } from 'src/app/classes/calendarday';

export class DateChangeEvent {
  date: Date;
};

@Component({
  selector: 'app-calendar-picker',
  templateUrl: './calendar-picker.component.html',
  styleUrls: ['./calendar-picker.component.css']
})


export class CalendarPickerComponent implements OnInit, OnChanges {
  public calendar: CalendarDay[] = [];
  public displayMonth: string;
  private monthIndex: number = 0;
  public minusDisable = false;
  public plusDisable = false;
  public currentMonth: number;
  public currentDate: Date;

  @Input() maxDate: Date;
  @Input() lang: any = {};
  @Input() minDate: Date;
  @Input() dateSelected: Date;
  @Input() listLockDays: string[] = [];
  @Input() filterWeeks: boolean = false;
  @Output() dateChange = new EventEmitter<DateChangeEvent>();
  @Output() monthChange = new EventEmitter<any>();


  public monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    debugger;
    if ('dateSelected' in changes) {
      this.dateSelected = changes.dateSelected.currentValue
      if (this.dateSelected) {
        if (this.dateSelected.getDay() == 6) {
          let date = addDays(this.dateSelected, 1);
          this.updateDate(date);
        }
        this.calendar.forEach(item => {
          item.isSelectedDay = false;
          if (this.getDateString(item.date) == this.getDateString(this.dateSelected))
            item.isSelectedDay = true;
        })
      }
    }
    if ('monthIndex' in changes) {
      console.log(changes);
    }
  }
  ngOnInit(): void {
    this.monthNames = this.lang.monthNames.split(',');

    // here we initialize the calendar
    this.generateCalendarDays(this.monthIndex);
  }
  public getDateString(date: Date): string {
    date = addMinutes(date, date.getTimezoneOffset() * (-1));
    return date.toISOString().split("T")[0];
  }
  private clearTime(date) {
    date.setMinutes(0);
    date.setHours(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date = addMinutes(date, date.getTimezoneOffset() * (-1));
    return date;

  }

  private generateCalendarDays(monthIndex: number): void {
    // we reset our calendar
    this.calendar = [];
    this.plusDisable = false;
    this.minusDisable = false;
    // we set the date 

    let day: Date = new Date();
    day.setMinutes(0);
    day.setHours(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
    day = addMinutes(day, day.getTimezoneOffset() * (-1));
    //let monthToAdd = day.getMonth() + monthIndex;
    day = addMonths(day, monthIndex);
    if (day >= this.maxDate) {
      this.plusDisable = true;
    }
    if (day <= this.minDate) {
      this.minusDisable = true;
    }
    this.currentMonth = day.getMonth();
    // set the dispaly month for UI
    this.displayMonth = this.monthNames[day.getMonth()];

    //check if current month is current date
    if (this.dateSelected.getMonth() > this.currentMonth && this.dateSelected.getFullYear() == day.getFullYear()) {
      this.setMonth(this.dateSelected.getMonth() - this.currentMonth);
      this.minusDisable = true;
      return;
    }
    let startingDateOfCalendar = this.getStartDateForCalendar(day);
    let dateToAdd = startingDateOfCalendar;

    for (var i = 0; i < 42; i++) {

      //check if not shabat selected
      if (this.dateSelected.getDay() == 6) {
        this.dateSelected = addDays(this.dateSelected, 1);
        this.updateDate(this.dateSelected);
      }
      let calendarDay = new CalendarDay(new Date(dateToAdd));
      calendarDay.isLockDay = this.listLockDays.includes(this.getDateString(dateToAdd))
      if (dateToAdd > this.maxDate)
        calendarDay.isLockDay = true;
      else if (this.clearTime(dateToAdd) < this.clearTime(this.minDate))
        calendarDay.isPastDate = true;
      else if (this.filterWeeks && calendarDay.date.getDay() == 6) //filter satarday (shabat)
        calendarDay.isLockDay = true;
      else if (calendarDay.isLockDay && this.getDateString(this.dateSelected) == this.getDateString(calendarDay.date)) { //check if all month date is full
        this.dateSelected = addDays(this.getDateString(calendarDay.date), 1)
        if (this.dateSelected.getMonth() > this.currentMonth)
          this.updateDate(this.dateSelected);
      }
      else if (this.getDateString(this.dateSelected) == this.getDateString(calendarDay.date)) {// render the selected date
        calendarDay.isSelectedDay = true;
        this.updateDate(calendarDay.date);
      }
      this.calendar.push(calendarDay);
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
  }

  private getStartDateForCalendar(selectedDate: Date) {
    // for the day we selected let's get the previous month last day
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(0));

    // start by setting the starting date of the calendar same as the last day of previous month
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;
    // but since we actually want to find the last Monday of previous month
    // we will start going back in days intil we encounter our last Monday of previous month
    if (startingDateOfCalendar.getDay() != 0) {
      do {
        startingDateOfCalendar = new Date(startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1));
      } while (startingDateOfCalendar.getDay() != 0);
    }

    return startingDateOfCalendar;
  }
  dateClick(e: CalendarDay) {
    let CalendarEvent = new DateChangeEvent();
    CalendarEvent.date = e.date;
    this.dateChange.emit(CalendarEvent);
  }
  updateDate(date: Date) {
    let CalendarEvent = new DateChangeEvent();
    CalendarEvent.date = date;
    this.dateChange.emit(CalendarEvent);

  }
  public increaseMonth() {
    this.monthIndex++;
    this.monthChange.emit(this.monthIndex)
    this.generateCalendarDays(this.monthIndex);
  }

  public decreaseMonth() {
    this.monthIndex--
    this.monthChange.emit(this.monthIndex)
    this.generateCalendarDays(this.monthIndex);
  }

  public setCurrentMonth() {
    this.monthIndex = 0;
    this.generateCalendarDays(this.monthIndex);
  }
  public setMonth(index) {
    this.monthIndex = index
    this.monthChange.emit(this.monthIndex)
    this.generateCalendarDays(this.monthIndex);
  }

}

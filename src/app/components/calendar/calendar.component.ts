import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Output()
  dateSelected: EventEmitter<Date> = new EventEmitter();
 
  @Output() selectedDate = new Date();

  @Input() minDate;
  @Input() maxDate;

  @Input() filterCalendar

 
  @ViewChild('calendar',{static:false}) calendar: MatCalendar<Date>;
 
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button');
    console.log(this.selectedDate);
    if (buttons) {
      Array.from(buttons).forEach(button => {
        this.renderer.listen(button, 'click', () => {
          console.log('Arrow buttons clicked');
        });
      });
    }
  }
 
  monthSelected(date: Date) {
    console.log('month changed');
  }
 
  dateChanged() {
    debugger;
    this.calendar.activeDate = this.selectedDate;
    this.dateSelected.emit(this.selectedDate);
  }


}

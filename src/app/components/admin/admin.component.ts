import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LocalresService } from 'src/app/services/localres.service';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';
import { Book } from 'src/app/classes/Book';
import { CalendarEvent } from 'angular-calendar';
import { GoogleEvent } from 'src/app/classes/GoogleEvents';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  localRes:any;
  constructor(private Localres:LocalresService,private API:ApiServiceService) { }

  ngOnInit() {
    this.Localres.getLocalResoruce("he").subscribe(res => {
      this.localRes = res;
    })
  }


}

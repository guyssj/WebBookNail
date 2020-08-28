import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { LocalresService } from '../../services/localres.service';
import { ApiServiceService } from '../../services/api-service.service';
import { Observable, timer } from 'node_modules/rxjs';
import { MatDialog } from '@angular/material';
import { DialogContentExampleDialog } from '../set-book/set-book.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private localres:LocalresService,private dialog:MatDialog) { }
  @Input() localRes:any;
  @Input() form:any;
  @Output() showChange = new EventEmitter<boolean>();

  scroll:boolean;
  ngOnInit() {
    if(this.form == 'Admin'){
      this.scroll = true;
    }
  }



  @HostListener("window:scroll", [])
  onWindowScroll() {

    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 50) {
      this.scroll = true;
    } else if (number < 50) {
       this.scroll = false;
    }
  }

  showPanelChange(){
    this.showChange.emit(true)
  }

}

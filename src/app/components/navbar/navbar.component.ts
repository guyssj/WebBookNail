import { Component, OnInit, Input } from '@angular/core';
import { LocalresService } from '../../localres.service';
import { ApiServiceService } from '../../api-service.service';
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
  ngOnInit() {
  }

  openDialog(message,time){
    this.dialog.open(DialogContentExampleDialog,{
      data:{
        message:'guygold'
      }
    });
    timer(time, 1000).pipe(
      take(1)).subscribe(x=>{
        this.dialog.closeAll();
       })
  }

}

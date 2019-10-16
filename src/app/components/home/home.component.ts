import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as $ from "jquery";
import { LocalresService } from '../../services/localres.service';
import { SetBookComponent } from '../set-book/set-book.component';
import { isObject } from 'util';
import { Customer } from 'src/app/classes/Customer';
import { Book } from 'src/app/classes/Book';
import { FormGroup } from '@angular/forms';
import { ApiServiceService } from 'src/app/services/api-service.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit ,AfterViewInit {
  localRes:any = {};
  hidetheSer:boolean;
  bookFound:Book = new Book();
  @ViewChild(SetBookComponent, { static: true }) setBookCom;
  constructor(private localres:LocalresService, private API:ApiServiceService) { }

  ngOnInit() {
    this.localres.getLocalResoruce("he").subscribe(data => {
      this.localRes = data;
      console.log(this.localRes);
    })
    $(function () {
      // ===== Scroll to Top ==== 
      $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
          $('#return-to-top').fadeIn(200);    // Fade in the arrow
        } else {
          $('#return-to-top').fadeOut(200);   // Else fade out the arrow
        }
      });
      $('#return-to-top').click(function () {      // When arrow is clicked
        $('body,html').animate({
          scrollTop: 0                       // Scroll to top of body
        }, 500);
      });
    });
    
  }

  ngAfterViewInit(){
  }

  whenCustomerFound(event){
    if(isObject(event)){
      this.bookFound = event;
      this.hidetheSer = true;
    }
    else{
      console.log(event);
    }
  }

  clear(){
    this.bookFound= null;
    this.hidetheSer = false;
  }
}

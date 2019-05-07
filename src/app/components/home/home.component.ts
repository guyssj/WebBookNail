import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as $ from "jquery";
import { LocalresService } from '../../localres.service';
import { SetBookComponent } from '../set-book/set-book.component';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit ,AfterViewInit {
  localRes:any = {};
  @ViewChild(SetBookComponent) setBookCom;
  constructor(private localres:LocalresService,private auth:AuthService) { }

  ngOnInit() {
    this.localres.getLocalResoruce("he").subscribe(data => {
      this.localRes = data;
      console.log(this.localRes)
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

  setBooking(){
    this.setBookCom.setBook();
  }
}

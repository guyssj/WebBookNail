import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as $ from "jquery";
import { LocalresService } from '../../services/localres.service';
import { SetBookComponent } from '../set-book/set-book.component';
import { isObject } from 'util';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Settings } from 'src/app/classes/StoreSettings';
import { SettingsService } from 'src/app/services/settings.service';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';
import { interval, Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  localRes: any = {};
  settings:Settings;
  hidetheSer: boolean;
  showSer:boolean = true;
  carouselBanner:any;
  bookFound: any;
  @ViewChild(SetBookComponent, { static: true }) setBookCom;
  constructor(private localres: LocalresService, private API: ApiServiceService, private Set:SettingsService) { }
  slides = [
    {text:"להיות שונה עם עיצוב הציפורניים בהתאמה אישית" , img:"assets/handsSmall.png",desc:"מספקת מגוון רחב של שירותי עיצוב ציפורניים עברוך"},
    {text:"טיפוח אישי באווירה אחרת, עם מוזיקה מעולה, והמון אהבה" , img:"assets/legsSmall.png",desc:"מספקת מגוון רחב של שירותי עיצוב ציפורניים עברוך"},
    {text:"text 3"},

  ];
  slideConfig = {  dots: true,
    infinite: true,
    speed: 300,
    fade:true,
    autoplay:true,
    slidesToShow: 1,
    adaptiveHeight: true};
  
  addSlide() {
  }
  
  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }
  
  slickInit(e) {
    console.log('slick initialized');
  }
  
  breakpoint(e) {
    console.log('breakpoint');
  }
  
  afterChange(e) {
    console.log('afterChange');
  }
  
  beforeChange(e) {
    console.log('beforeChange');
  }
  ngOnInit() {
    this.localres.getLocalResoruce("he").subscribe(data => {
      this.localRes = data;
    })
    this.Set.getSettings().subscribe(res=>{
      this.settings = res;
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
  ngAfterViewInit() {
  }


  whenCustomerFound(event) {
    if (isObject(event)) {
      this.bookFound = event;
      this.hidetheSer = true;
    }
    else {
      console.log(event);
    }
  }

  clear(event) {
    if (event) {
      this.bookFound = null;
      this.hidetheSer = false;
    }
    this.showSer = false;
  }

  showPanel(event){
    this.showSer = true;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from "jquery";
import { LocalresService } from '../../services/localres.service';
import { SetBookComponent } from '../../components/set-book/set-book.component';
import { isObject } from 'util';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Settings } from 'src/app/classes/StoreSettings';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { SetBookDialogComponent } from 'src/app/dialogs/set-book-dialog/set-book-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  localRes: any = {};
  settings: Settings;
  hidetheSer: boolean;
  showSer: boolean = true;
  carouselBanner: any;
  bookFound: any;
  @ViewChild(SetBookComponent, { static: true }) setBookCom;
  constructor(private localres: LocalresService,
    private Set: SettingsService,
    public dialog: MatDialog,
  ) { }
  slides = [
    { id: "text21312", text: "הסרת שיער בלייזר היא הדרך היעילה, המהירה והמשתלמת ביותר להסרת שיער", img: "assets/2.jpg", desc: "" },
    { id: "text24312", text: "!עכשיו אצלי בקליניקה", img: "assets/3.jpg", desc: "הסרת שיער סופר מהירה ללא כאבים או תופעות לוואי" },
    { id: "text22312", text: "טיפוח אישי באווירה אחרת, עם מוזיקה מעולה, והמון אהבה", img: "assets/4.jpg", desc: "" },
    { id: "text22314", text: "רק אצל מיריתוש תרגישי מיוחדת עם עיצוב הציפורניים בהתאמה אישית", img: "assets/5.jpg", desc: "" },
    { id: "text22314", text: "חדש! הסרת שיער בלייזר ללא כאבים", img: "assets/6.JPG", desc: "" }

  ];
  slideConfig = {
    dots: true,
    infinite: true,
    speed: 300,
    fade: true,
    autoplay: true,
    slidesToShow: 1,
    adaptiveHeight: true
  };

  SlideOptions = {
    items: 1,
    loop: true,
    dots: false,
    touchDrag: true,
    margin: 0,
    autoplay: true,
    navSpeed: 100,
    smartSpeed: 500,
    animateOut: 'fadeOut',
    nav: true,
    autoHeight: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  };
  // customOptions: OwlOptions = {
  //   loop: true,
  //   mouseDrag: false,
  //   touchDrag: false,
  //   pullDrag: true,
  //   margin:30,
  //   autoHeight:true,
  //   dots: true,
  //   navSpeed: 700,
  //   navText: ['', ''],
  //   items:1,
  //   nav: false
  // }

  openSetBook() {
    this.dialog.open(SetBookDialogComponent, {
      data: { localRes: this.localRes, settings: this.settings },
      maxWidth: '97vw',
      maxHeight: '90vh'
    });
  }

  ngOnInit() {
    this.localres.getLocalResoruce("he").subscribe(data => {
      this.localRes = data;
    })
    this.Set.getSettings().subscribe(res => {
      this.settings = res;
    })
    $(function () {
      $(window).on("scroll", function () {
        var bodyScroll = $(window).scrollTop(),
          navbar = $(".navbar"),
          logo = $(".navbar .logo> img");
        if (bodyScroll > 100) {
          navbar.addClass("nav-scroll");
          logo.attr('src', 'img/logo-dark.png');
        } else {
          navbar.removeClass("nav-scroll");
          logo.attr('src', 'img/logo-light.png');
        }
      });
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


}

import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from "jquery";
import { LocalresService } from '../../services/localres.service';
import { SetBookComponent } from '../../components/set-book/set-book.component';
import { Settings } from 'src/app/classes/StoreSettings';
import { SettingsService } from 'src/app/services/settings.service';
import { MatDialog } from '@angular/material/dialog';
import { SetBookDialogComponent } from 'src/app/dialogs/set-book-dialog/set-book-dialog.component';
import { AdvDialogComponent } from 'src/app/dialogs/adv-dialog/adv-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  localRes: any = {};
  settings: Settings;
  constructor(private localres: LocalresService,
    private Set: SettingsService,
    public dialog: MatDialog,
  ) { }
  slides = [
    { text: "הסרת שיער בלייזר היא הדרך היעילה, המהירה והמשתלמת ביותר להסרת שיער", img: "assets/2.jpg", desc: "" },
    { text: "!עכשיו אצלי בקליניקה", img: "assets/3.jpg", desc: "הסרת שיער סופר מהירה ללא כאבים או תופעות לוואי" },
    { text: "טיפוח אישי באווירה אחרת, עם מוזיקה מעולה, והמון אהבה", img: "assets/4.jpg", desc: "" },
    { text: "רק אצל מיריתוש תרגישי מיוחדת עם עיצוב הציפורניים בהתאמה אישית", img: "assets/5.jpg", desc: "" },

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
          navbar = $(".navbar")
        if (bodyScroll > 100) {
          navbar.addClass("nav-scroll");
        } else {
          navbar.removeClass("nav-scroll");
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
    this.dialog.open(AdvDialogComponent, {
      data: { localRes: this.localRes, settings: this.settings },
      maxWidth: '97vw',
      maxHeight: '90vh'
    });
  }


}

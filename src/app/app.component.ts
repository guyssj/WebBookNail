import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-1X4HX6LX5D',
          {
            'page_path': event.urlAfterRedirects,
            cookie_flags: 'max-age=7200;secure;samesite=lax'
          }
        );
      }
    }
    )
  }
  @HostListener("window:scroll", [])
  onWindowScroll() {

    var navbar = document.getElementById("navbar");
    var sticky = navbar.offsetTop;
    if (window.pageYOffset >= sticky) {
      navbar.classList.add("sticky")
    } else {
      navbar.classList.remove("sticky");
    }



  }
}
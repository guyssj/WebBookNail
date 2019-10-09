import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isActive: boolean = false;
  showMenu: string = '';
  pushRightClass: string = 'push-right';
  @Input() localRes:any;
  userGoogle:any;
  constructor(private auth:AuthService) { }

  ngOnInit() {
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  SignInToGoogle() {
    this.auth.login().then(user => {
      console.log(user);

      this.userGoogle = user;
    });
  }

  signOut() {
    this.auth.logout();
  }

}

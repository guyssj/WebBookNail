import { Component } from '@angular/core';
import { LocalresService } from './services/localres.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  localRes:any = {};
  title = 'BookNail';
  /**
   *
   */
  constructor(private localres:LocalresService) {
    this.localres.getLocalResoruce("he").subscribe(data => {
      this.localRes = data;
    })
  }
}

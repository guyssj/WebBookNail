import { Component, OnInit } from '@angular/core';
import { LocalresService } from '../../localres.service';
import { ApiServiceService } from '../../api-service.service';
import { Observable } from 'node_modules/rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private localres:LocalresService) { }
  localRes:any = {};
  ngOnInit() {
    this.localres.getLocalResoruce("he").subscribe(data => {
      this.localRes = data;
      console.log(this.localRes)
    })
  }

}

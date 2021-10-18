import { Component, OnInit } from '@angular/core';
import { LocalresService } from 'src/app/services/localres.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  localRes: any;
  constructor(private Localres: LocalresService) { }

  ngOnInit() {
    this.Localres.getLocalResoruce("he").subscribe(res => {
      this.localRes = res;
    })
  }


}

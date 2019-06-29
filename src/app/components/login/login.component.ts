import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/api-service.service';
import { Router } from '@angular/router';
import { LocalresService } from 'src/app/localres.service';
import { resultsAPI } from 'src/app/results';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  localRes: any;
  key: string = "";
  userName: string = "";
  APIResult: resultsAPI<string>;
  constructor(private API: ApiServiceService, private localres: LocalresService, private router: Router) { }

  onSubmit(f: NgForm) {
    if (f.valid) {
      this.API.login(f.value).subscribe(res => {
        var tokens = res.headers.get('X-Token');
        this.router.navigate(['/Calendar'], { queryParams: { TokenApi: tokens } });
      }, error => {
        this.APIResult = error.error;
        console.log(this.APIResult);
      });
    }
  }

  ngOnInit() {
    this.localres.getLocalResoruce("he").subscribe(data => {
      this.localRes = data;
      console.log(this.localRes)
    })
  }

}

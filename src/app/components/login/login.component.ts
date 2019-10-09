import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Router } from '@angular/router';
import { LocalresService } from 'src/app/services/localres.service';
import { resultsAPI } from 'src/app/classes/results';
import { AuthService } from 'src/app/services/auth.service';


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
  constructor(private API: ApiServiceService, private localres: LocalresService, private router: Router,
    public auth:AuthService) { }

  onSubmit(f: NgForm) {
    if (f.valid) {
      this.API.login(f.value).subscribe(res => {
        var tokens = res.headers.get('X-Token');
        this.router.navigate(['Admin/Calendar'], { queryParams: { TokenApi: tokens } });
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

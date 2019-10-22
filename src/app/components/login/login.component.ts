import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Router } from '@angular/router';
import { LocalresService } from 'src/app/services/localres.service';
import { resultsAPI } from 'src/app/classes/results';
import { AuthService } from 'src/app/services/auth.service';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { first } from 'rxjs/operators';


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
  constructor(private AuthLogin: AuthTokenService, private localres: LocalresService, private router: Router) { }

  onSubmit(f: NgForm) {
    if (f.valid) {
      this.AuthLogin.login(f.value)
      .pipe(first())
      .subscribe(
          data => {
              this.router.navigate(['Admin/Calendar']);
          },
          error => {
            this.APIResult.ErrorMessage = error.error;
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

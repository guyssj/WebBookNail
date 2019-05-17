import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  key:string = "23";
  userName:string ="343";

  constructor(private API:ApiServiceService,  private router: Router) { }

  onSubmit(f: NgForm) {
    this.API.login(f.value).subscribe(res => {
      var tokens = res.headers.get('X-Token');
      this.router.navigate(['/Calendar'],{ queryParams: { TokenApi: tokens} });
    });
    
  }
  ngOnInit() {
  }

}

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { DialogContentExampleDialog } from '../set-book/set-book.component';
import { timer } from 'rxjs';
import { take, first } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { addDays, min } from 'date-fns';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { DialogService } from 'src/app/services/dialog.service';
import { CustomerService } from 'src/app/services/customer.service';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.css']
})
export class SearchBookComponent implements OnInit {
  phoneNumber: string;
  constructor(private API: ApiServiceService, private booksService:BooksService, private cusService: CustomerService, private dialog: DialogService, private AuthLogin: AuthTokenService) { }
  @Output() BookFounded = new EventEmitter<any>();
  @Input() localRes: any;
  @Output() Clear = new EventEmitter<boolean>();

  showOTP: boolean = false;
  token: string;
  dateNow: Date = new Date(Date.now());
  OtpMissing: boolean = false;
  ngOnInit() {

  }

  SearchByPhone(phone: string) {
    if (!phone)
      return;
    this.cusService.generateOTP(this.phoneNumber).subscribe(token => {
      if (token.Result) {
        this.showOTP = true;
      }
      else {
        this.dialog.openDialog({ message: this.localRes.CustomerNotFound, type: typeMessage.Error }, 3000);
      }
    })
  }

  enter() {
    this.AuthLogin.otpLogin(this.phoneNumber, this.token)
      .pipe(first())
      .subscribe(
        data => {
          if (data.token) {
            this.booksService.GetBooksByCustomerPhone().subscribe(book => {
              if (book.Result.length > 0) {
                var dateNowPlus2 = this.dateNow;
                var minDate = new Date(dateNowPlus2.toISOString().split("T")[0]);
                var newBooks = book.Result.filter(book => new Date(book.StartDate).getTime() >= minDate.getTime()); //filter only book 2 day ahead
                this.BookFounded.emit({ book: newBooks });
                this.showOTP = false;
                this.token = '';
                this.Clear.emit(false);
              }
              else {
                this.dialog.openDialog({ message: this.localRes.CustomerNotFound, type: typeMessage.Error }, 3000);
              }
            }, error => {
              this.dialog.openDialog({ message: this.localRes.CustomerNotFound, type: typeMessage.Error }, 3000);
            })
          }
          else{
            this.dialog.openDialog({ message: this.localRes.OTPInvalid, type: typeMessage.Error }, 3000);
          }
        },
        error => {
          this.dialog.openDialog({ message: this.localRes.CustomerNotFound, type: typeMessage.Error }, 3000);
        });
  }

}

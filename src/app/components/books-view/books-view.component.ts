import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatDialog } from '@angular/material';
import { Book } from 'src/app/classes/Book';

export interface bookDetails{
  book:Book[],
  OTP:string
}

@Component({
  selector: 'app-books-view',
  templateUrl: './books-view.component.html',
  styleUrls: ['./books-view.component.css']
})
export class BooksViewComponent implements OnInit {

  @Input() booksDetails: bookDetails;
  @Input() localRes: any;
  @Output() Clear = new EventEmitter<boolean>();


  constructor(private API: ApiServiceService, private dialog: MatDialog) { }

  ngOnInit() {
    debugger;
  }

}

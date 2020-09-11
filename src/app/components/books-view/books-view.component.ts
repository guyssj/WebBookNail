import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatDialog } from '@angular/material';
import { Book } from 'src/app/classes/Book';
import { ServiceTypes } from 'src/app/classes/servicetypes';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { DialogComponent } from '../dialog/dialog.component';

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
  newEnd:string;
  serviceTypes:ServiceTypes[] =[] ;
  loader:boolean = true;
  bookEdit:bookDetails;


  constructor(private API: ApiServiceService, private dialog: MatDialog) { 
    
  }

  ngOnInit() {
    this.getallServiceTypes();
    timer(1000, 1000).pipe(
      take(1)).subscribe(x => {
        this.booksDetails.book.forEach(book =>{
         book.Notes = this.serviceTypes.filter(servt => servt.ServiceTypeID == book.ServiceTypeID)[0].ServiceTypeName;
        })
        this.loader = false;

      })

  }

  buttonChange(bookEdit){
    this.bookEdit = bookEdit;
  }

  ClearAll(){
    this.bookEdit = null;
    this.Clear.emit(true);

  }
  async getallServiceTypes(){
    this.serviceTypes = await this.API.getAllServiceTypes();
  }

}

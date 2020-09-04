import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-books-view',
  templateUrl: './books-view.component.html',
  styleUrls: ['./books-view.component.css']
})
export class BooksViewComponent implements OnInit {

  constructor(private API: ApiServiceService, private dialog: MatDialog) { }

  ngOnInit() {
  }

}

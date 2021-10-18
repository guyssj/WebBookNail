import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BooksViewDialogComponent } from 'src/app/dialogs/books-view-dialog/books-view-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private dialog: MatDialog) { }
  @Input() localRes: any;
  @Input() form: any;
  @Output() showChange = new EventEmitter<boolean>();

  scroll: boolean;
  ngOnInit() {
    if (this.form == 'Admin') {
      this.scroll = true;
    }
  }


  showPanelChange() {
    this.dialog.open(BooksViewDialogComponent, {
      data: { localRes: this.localRes },
      maxWidth: '97vw',
      maxHeight: '90vh'
    });
  }

}

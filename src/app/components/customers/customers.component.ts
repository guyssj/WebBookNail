import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Customer } from 'src/app/classes/Customer';
import { MatTableDataSource } from '@angular/material';
import { LocalresService } from 'src/app/services/localres.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  constructor(private API:ApiServiceService, private localres:LocalresService) { }
  Customers:Customer[] = [];
  displayedColumns: string[] = ['firstname', 'lastname', 'phonenumber'];
  resultsLen:any;
  localRes:any;
  dataSource:MatTableDataSource<Customer>;
  ngOnInit() {
    this.getAllCustomers();
    this.localres.getLocalResoruce('he').subscribe(res =>{
      this.localRes = res;
    })
  }

  async getAllCustomers() {
    this.Customers = await this.API.GetAllCustomers();
    this.dataSource = new MatTableDataSource(this.Customers);
    this.resultsLen = this.Customers.length;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

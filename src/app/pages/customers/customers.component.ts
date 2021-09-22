import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Customer } from 'src/app/classes/Customer';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LocalresService } from 'src/app/services/localres.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  constructor(private cusService: CustomerService, private localres: LocalresService) { }
  Customers: Customer[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['firstname', 'lastname', 'phonenumber'];
  resultsLen: any;
  localRes: any;
  loader: boolean = true;
  dataSource: MatTableDataSource<Customer>;
  ngOnInit() {
    this.getAllCustomers();
    this.localres.getLocalResoruce('he').subscribe(res => {
      this.localRes = res;
    })
  }

  async getAllCustomers() {
    this.Customers = await this.cusService.GetAllCustomers();
    this.dataSource = new MatTableDataSource(this.Customers);
    this.resultsLen = this.Customers.length;
    this.dataSource.paginator = this.paginator;
    this.loader = false;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

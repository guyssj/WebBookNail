import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ServiceTypes } from 'src/app/classes/servicetypes';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { LocalresService } from 'src/app/services/localres.service';
import { Services } from 'src/app/classes/Services';
import { ServicetypeService } from 'src/app/services/servicetype.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  Services: Services[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['ServiceID', 'ServiceName'];
  resultsLen: any;
  localRes: any;
  dataSource: MatTableDataSource<Services>;
  constructor(private localres: LocalresService, private API: ApiServiceService, private servService: ServicetypeService) { }

  ngOnInit() {
    this.GetAllServices();
    this.localres.getLocalResoruce('he').subscribe(res => {
      this.localRes = res;
    })
  }

  async GetAllServices() {
    this.servService.getAllServices().subscribe(data => {
      this.Services = data.Result;
      this.dataSource = new MatTableDataSource(this.Services);
      this.dataSource.paginator = this.paginator;
    })

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

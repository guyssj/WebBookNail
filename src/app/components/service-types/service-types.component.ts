import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { ServiceTypes } from 'src/app/classes/servicetypes';
import { LocalresService } from 'src/app/services/localres.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-service-types',
  templateUrl: './service-types.component.html',
  styleUrls: ['./service-types.component.css']
})
export class ServiceTypesComponent implements OnInit {

  constructor(private API:ApiServiceService,private localres:LocalresService) { }
  ServiceTypes:ServiceTypes[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['ServiceTypeName', 'ServiceID', 'Description','Price','Duration'];
  resultsLen:any;
  localRes:any;
  dataSource:MatTableDataSource<ServiceTypes>;
  ngOnInit() {
    this.GetAllServiceTypes();
    this.localres.getLocalResoruce('he').subscribe(res =>{
      this.localRes = res;
    })
  }

  async GetAllServiceTypes(){
    this.ServiceTypes = await this.API.getAllServiceTypes();
    this.dataSource = new MatTableDataSource(this.ServiceTypes);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

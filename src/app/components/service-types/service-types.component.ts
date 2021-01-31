import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { ServiceTypes } from 'src/app/classes/servicetypes';
import { LocalresService } from 'src/app/services/localres.service';
import { MatPaginator, MatTableDataSource, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Services } from 'src/app/classes/Services';
import { DialogContentExampleDialog } from '../set-book/set-book.component';
import { MessageConfig, typeMessage } from '../MessageConfig';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ServicetypeService } from 'src/app/services/servicetype.service';

@Component({
  selector: 'app-service-types',
  templateUrl: './service-types.component.html',
  styleUrls: ['./service-types.component.css']
})
export class ServiceTypesComponent implements OnInit {

  constructor(private API: ApiServiceService, private servService:ServicetypeService,private localres: LocalresService, private dialog: MatDialog) { }
  ServiceTypes: ServiceTypes[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['ServiceTypeName', 'ServiceID', 'Description', 'Price', 'Duration'];
  resultsLen: any;
  localRes: any;
  loader:boolean = true;
  dataSource: MatTableDataSource<ServiceTypes>;
  ngOnInit() {
    this.GetAllServiceTypes();
    this.localres.getLocalResoruce('he').subscribe(res => {
      this.localRes = res;
    })
  }

  async GetAllServiceTypes() {
    this.ServiceTypes = await this.servService.getAllServiceTypes();
    this.dataSource = new MatTableDataSource(this.ServiceTypes);
    this.dataSource.paginator = this.paginator;
    this.loader = false;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addNewServiceType() {
    this.dialog.open(AddNewServiceType, {
      data: this.localRes,
      disableClose: true
    });
  }

}

@Component({
  selector: 'dialog-for-click-event',
  templateUrl: 'service-type.component-dialog.html',
})
export class AddNewServiceType implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: any,
    public dialogRef: MatDialogRef<AddNewServiceType>,
    public fb: FormBuilder,
    public API: ApiServiceService,
    private servService: ServicetypeService,

    private alert: MatDialog) { }

  public ServiceTypeForm = this.fb.group({
    ServiceTypeName: [null, Validators.required],
    ServiceID: [null],
    Description: [null],
    Duration: [null],
    Price: [null]
  })

  Services: Services[] = [];

  ngOnInit() {
    this.getAllService();
  }

  getAllService() {
    this.servService.getAllServices().subscribe(data => {
      this.Services = data.Result;
    });
  }
  saveServiceType() {
    if (!this.ServiceTypeForm.valid) {
      Object.keys(this.ServiceTypeForm.controls).forEach(field => { // {1}
        const control = this.ServiceTypeForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
    }
    else {
      this.servService.addServiceType(this.ServiceTypeForm.value).subscribe(data => {
        if (data.Result > 0) {
          this.openDialog({ message: this.data.SuccessApp, type: typeMessage.Success }, 3000)
        }
        else {
          this.openDialog({ message: data.ErrorMessage, type: typeMessage.Error }, 5000)
        }
      })
    }
  }
  openDialog(messageObj: MessageConfig, time) {
    this.alert.open(DialogContentExampleDialog, {
      data: messageObj
    });
    timer(time, 1000).pipe(
      take(1)).subscribe(x => {
        this.alert.closeAll();
      })
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

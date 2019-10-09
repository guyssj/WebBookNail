import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';
import { CustomersComponent } from '../customers/customers.component';
import { ServicesComponent } from '../services/services.component';
import { ServiceTypesComponent } from '../service-types/service-types.component';

const routes: Routes = [
  {
    path: 'Admin',
    component: AdminComponent,
    children: [
      {
        path: 'Calendar',
        component: CalendarViewComponent
      },
      {
        path: 'Customers',
        component: CustomersComponent
      },
      {
        path: 'Services',
        component: ServicesComponent
      },
      {
        path: 'ServiceTypes',
        component: ServiceTypesComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AdminRoutingModule { }

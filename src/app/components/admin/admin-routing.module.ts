import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';
import { CustomersComponent } from '../../pages/customers/customers.component';
import { ServicesComponent } from '../../pages/services/services.component';
import { ServiceTypesComponent } from '../../pages/service-types/service-types.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'Admin',
    component: AdminComponent,
    children: [
      {
        path: 'Calendar',
        component: CalendarViewComponent,
        canActivate: [AuthGuard]
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

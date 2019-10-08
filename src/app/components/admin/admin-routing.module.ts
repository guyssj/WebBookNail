import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';

const routes: Routes = [
  {
    path: 'Admin',
    component: AdminComponent,
    children: [
      {
        path: 'Calendar',
        component: CalendarViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AdminRoutingModule { }

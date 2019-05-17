import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SetBookComponent } from './components/set-book/set-book.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { ApiServiceService } from './api-service.service';
import { HttpClientModule } from '@angular/common/http';
import localeHe from '@angular/common/locales/he';
import { registerLocaleData } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LocalresService } from './localres.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {NgbModule, NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './dateformat';
import { AuthService } from './auth.service';
import { LoginComponent } from './components/login/login.component';
registerLocaleData(localeHe);

const routes: Routes = [
  { path: 'setbook', component: SetBookComponent },
  { path: 'Customers', component: CustomersComponent },
  { path: 'Calendar', component: CalendarViewComponent },
  { path: '', component: HomeComponent },
  { path: 'Admin', component: LoginComponent }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[ApiServiceService,LocalresService,AuthService,{provide:LocationStrategy,useClass:HashLocationStrategy},{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}]
})
export class AppRoutingModule { }
export const routingComponents = [SetBookComponent, CustomersComponent, CalendarViewComponent,LoginComponent];

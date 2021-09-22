import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SetBookComponent } from './components/set-book/set-book.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { ApiServiceService } from './services/api-service.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeHe from '@angular/common/locales/he';
import { registerLocaleData } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { LocalresService } from './services/localres.service';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './classes/dateformat';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './pages/login/login.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthTokenService } from './services/auth-token.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AuthGuard } from './guards/auth.guard';
registerLocaleData(localeHe);

const routes: Routes = [
  { path: 'Setbook', component: SetBookComponent },
  { path: 'Calendar', component: CalendarViewComponent },
  { path: '', component: HomeComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'Gallery', component: GalleryComponent }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    ApiServiceService,
    AuthTokenService,
    LocalresService,
    AuthService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
})
export class AppRoutingModule { }
export const routingComponents = [SetBookComponent, CustomersComponent, CalendarViewComponent, LoginComponent];

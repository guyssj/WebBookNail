import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, MatProgressBarModule, MatTableModule, MatPaginatorModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeHe from '@angular/common/locales/he';
import { registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { SetBookComponent, DialogContentExampleDialog } from './components/set-book/set-book.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { CustomersComponent } from './components/customers/customers.component';
import { ApiServiceService } from './services/api-service.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LocalresService } from './services/localres.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './classes/dateformat';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth'
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { DialogForClickEvent } from './components/calendar-view/calendar-view.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ChangeBookComponent } from './components/change-book/change-book.component';
import { SearchBookComponent } from './components/search-book/search-book.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminRoutingModule } from './components/admin/admin-routing.module';
import { ServicesComponent } from './components/services/services.component';
import { ServiceTypesComponent, AddNewServiceType } from './components/service-types/service-types.component';
import { AuthTokenService } from './services/auth-token.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { DialogComponent } from './components/dialog/dialog.component';

registerLocaleData(localeHe);

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    CustomersComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    DialogContentExampleDialog,
    DialogForClickEvent,
    GalleryComponent,
    ChangeBookComponent,
    SearchBookComponent,
    SidebarComponent,
    AdminComponent,
    ServicesComponent,
    ServiceTypesComponent,
    DialogComponent,
    AddNewServiceType
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    NgbModule,
    BrowserAnimationsModule,
    NgSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireAuthModule,
    AdminRoutingModule,
    FontAwesomeModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    ApiServiceService, 
    LocalresService,
    AuthTokenService,
    AuthService,
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents:[DialogContentExampleDialog,DialogForClickEvent,DialogComponent,AddNewServiceType]
})
export class AppModule { 
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(fas);
  }
}

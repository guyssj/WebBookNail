import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeHe from '@angular/common/locales/he';
import { registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { SetBookComponent, DialogContentExampleDialog } from './components/set-book/set-book.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { CustomersComponent } from './components/customers/customers.component';
import { ApiServiceService } from './api-service.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LocalresService } from './localres.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './dateformat';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth'
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
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
    AdminComponent
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
    MatDialogModule,
    MatIconModule,
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
  providers: [ApiServiceService, LocalresService, AuthService , { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  bootstrap: [AppComponent],
  entryComponents:[DialogContentExampleDialog,DialogForClickEvent]
})
export class AppModule { 
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(fas);
  }
}

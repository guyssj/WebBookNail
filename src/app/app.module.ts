import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeHe from '@angular/common/locales/he';
import { registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { OwlModule } from 'ngx-owl-carousel';
import { DialogContentExampleDialog } from './components/set-book/set-book.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { CustomersComponent } from './pages/customers/customers.component';
import { ApiServiceService } from './services/api-service.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { LocalresService } from './services/localres.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './classes/dateformat';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth'
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './pages/login/login.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { DialogForClickEvent } from './components/calendar-view/calendar-view.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { ChangeBookComponent } from './components/change-book/change-book.component';
import { SearchBookComponent } from './components/search-book/search-book.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminRoutingModule } from './components/admin/admin-routing.module';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceTypesComponent, AddNewServiceType } from './pages/service-types/service-types.component';
import { AuthTokenService } from './services/auth-token.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { DialogComponent } from './components/dialog/dialog.component';
import { MinToTimePipe } from './pipes/min-to-time.pipe';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { BooksViewComponent } from './components/books-view/books-view.component';
import { CustomerService } from './services/customer.service';
import { BooksService } from './services/books.service';
import { ServicetypeService } from './services/servicetype.service';
import { CalendarService } from './services/calendar.service';
import { CalendarPickerComponent } from './components/calendar-picker/calendar-picker.component';
import { ChunkPipe } from './pipes/chunk.pipe';
import { SetBookDialogComponent } from './dialogs/set-book-dialog/set-book-dialog.component';
import { BooksViewDialogComponent } from './dialogs/books-view-dialog/books-view-dialog.component';
import { AdvDialogComponent } from './dialogs/adv-dialog/adv-dialog.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

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
    SetBookDialogComponent,
    GalleryComponent,
    ChangeBookComponent,
    SearchBookComponent,
    SidebarComponent,
    AdminComponent,
    ServicesComponent,
    ServiceTypesComponent,
    DialogComponent,
    AddNewServiceType,
    MinToTimePipe,
    BooksViewComponent,
    CalendarPickerComponent,
    ChunkPipe,
    SetBookDialogComponent,
    BooksViewDialogComponent,
    AdvDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OwlModule,
    CarouselModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    NgbModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatChipsModule,
    MatOptionModule,
    MatMenuModule,
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
    CustomerService,
    BooksService,
    CalendarService,
    ServicetypeService,
    AuthService,
    GoogleAnalyticsService,
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
  //entryComponents: [DialogContentExampleDialog, DialogForClickEvent, DialogComponent, AddNewServiceType, SetBookDialogComponent]
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(fab, faGoogle);
    library.add(fas);
  }
}

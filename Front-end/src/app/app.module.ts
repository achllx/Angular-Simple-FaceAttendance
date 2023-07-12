import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from "@angular/material/list";
import { RecordComponent } from './dashboard-page/record/record.component'
import { RegisterComponent } from './register-page/register/register.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { QuoteService } from './service/quote/quote.service';
import { ForgotDialog, LoginComponent } from './login-page/login/login.component';
import { DashboardComponent } from './dashboard-page/dashboard/dashboard.component';
import { NotFoundComponent } from './notfound-page/not-found/not-found.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AttendanceComponent } from './dashboard-page/attendance/attendance.component';
import { SettingComponent } from './dashboard-page/setting/setting.component';
import { MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { AdminDasboardPageComponent } from './admin-dasboard-page/admin-dasboard-page.component';
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    AttendanceComponent,
    NotFoundComponent,
    RecordComponent,
    SettingComponent,
    ForgotDialog,
    AdminDasboardPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatListModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule
  ],
  providers: [
    QuoteService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

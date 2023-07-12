import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { RegisterComponent } from './register-page/register/register.component';
import { LoginComponent } from './login-page/login/login.component';
import { AdminAuthService } from './service/auth/admin-auth/admin-auth.service';
import { DashboardComponent } from './dashboard-page/dashboard/dashboard.component';
import { UserAuthService } from './service/auth/user-auth/user-auth.service';
import { NotFoundComponent } from './notfound-page/not-found/not-found.component';
import { FormAuthService } from './service/auth/form-auth/form-auth.service';
import { AttendanceComponent } from './dashboard-page/attendance/attendance.component';
import { RecordComponent } from './dashboard-page/record/record.component';
import { SettingComponent } from './dashboard-page/setting/setting.component';
import { AdminDasboardPageComponent } from './admin-dasboard-page/admin-dasboard-page.component';

const routes: Routes = [
  {
    path: 'absentia/register', component: RegisterComponent, canActivate: [AdminAuthService], canDeactivate: [FormAuthService]
  },
  {
    path: 'absentia/login', component: LoginComponent,
  },
  {
    path: 'absentia/admin-dashboard', component: AdminDasboardPageComponent
  },
  {
    path: 'absentia/:id', component: DashboardComponent, canActivate : [UserAuthService]
    // path: 'absentia', component: DashboardComponent, 
  },
  {
    path: 'absentia/:id/time-management', component: AttendanceComponent, canActivate : [UserAuthService]
  },
  {
    path: 'absentia/:id/record-attendance/:type', component: RecordComponent, canActivate : [UserAuthService]
  },
  {
    path: 'absentia/:id/setting', component: SettingComponent, canActivate: [UserAuthService]
  },
  {
    path: '', redirectTo: '/absentia/login', pathMatch: 'full'
  },
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

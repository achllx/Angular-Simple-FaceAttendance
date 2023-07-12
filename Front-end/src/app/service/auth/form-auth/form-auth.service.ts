import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from 'src/app/login-page/login/login.component';
import { RegisterComponent } from 'src/app/register-page/register/register.component';

@Injectable({
  providedIn: 'root'
})
export class FormAuthService implements CanDeactivate<any> {

  constructor() { }
  canDeactivate( component: LoginComponent | RegisterComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.isFormDirty()) {
      const confirmMessage = window.confirm('You have unsaved changes. Do you want to leave this page?');
      return confirmMessage;
    }
    return true;
  }
}

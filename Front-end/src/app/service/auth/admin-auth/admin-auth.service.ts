import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService implements CanActivate {

  constructor(private router: Router) { }

  canActivate (): boolean {
    if(window.localStorage.getItem('role')!=='admin absentia'){
      this.router.navigate(['/absentia/login']);
      return false;
    }

    return true;
  }
  
}

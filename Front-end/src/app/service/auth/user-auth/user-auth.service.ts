import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DeviceService } from '../../device/device.service';
import { ApiService } from '../../api/api.service';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService implements CanActivate {
  constructor(
    private device: DeviceService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (!this.device.getDevice()) {
      console.log('bukan mobile device');
      alert('Please user your mobile device');
      window.localStorage.removeItem('token');
      this.router.navigate(['/absentia/login']);
      return false;
    }

    if (!window.localStorage.getItem('token')) {
      alert('Please do the login Step Properly');
      this.router.navigate(['/absentia/login']);
      return false;
    }

    if (window.localStorage.getItem('role') === 'admin'){
      this.router.navigate(['/absentia/admin-dasboard']);
      return false;
    }

    return true;
  }
}

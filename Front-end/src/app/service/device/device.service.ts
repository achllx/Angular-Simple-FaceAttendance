import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private checkDevice: DeviceDetectorService) { }

  setDevice(): void {
    if (typeof (Storage) !== undefined) {
      
      //check is the localStorage have item "isMobile" or not
      if(window.localStorage.getItem("isMobile")){
        
      }else{
        const isMobile = this.checkDevice.isMobile();
        window.localStorage.setItem("isMobile", JSON.stringify(isMobile));
      }
    }else {
      alert('your browser is not supported');
    }
  }

  getDevice() {
    return window.localStorage.getItem("isMobile") === "true";
  }
}

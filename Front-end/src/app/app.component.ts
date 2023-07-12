import {Component, OnInit} from '@angular/core';
import { DeviceService } from './service/device/device.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private device: DeviceService) {
    
  }
  ngOnInit(): void {
    this.device.setDevice();
  }

}

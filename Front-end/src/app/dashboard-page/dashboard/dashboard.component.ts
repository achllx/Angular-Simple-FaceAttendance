import { Validators } from '@angular/forms';
import { userData } from './../../login-page/login/login.component';
import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  timeIn: string = '--:--';
  timeOut: string = '--:--';
  onTime: string = '-';
  totalDay: string = '0';
  workStartTime: string = '08:30';

  userName: string = '';
  userEmail: string = '';
  userStatus: string = '';
  userAgency: string = '';
  userPicture: string = '';

  private id: string = '';
  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private service: ApiService,
    private sanitizer: DomSanitizer
  ) {}
  
  ngAfterViewInit(): void {
    this.service.getTodayAttendance().subscribe((res) => {
        
      if (res.validation) {
        this.timeIn = '--:--';
        this.timeOut = '--:--';
      } else{
        this.timeIn = res.data[0].clock_in;
        this.timeOut = res.data[0].clock_out;

        if (this.timeIn !== null) {
          this.timeIn = new Date(res.data[0].clock_in)
          .toLocaleTimeString(
            [], {hour: '2-digit', minute: '2-digit', hour12: false});

          this.calculateOnTimePercentage();

          if (this.timeOut !== null) {
            this.timeOut = new Date(res.data[0].clock_out)
            .toLocaleTimeString(
              [],
              { hour: '2-digit', minute: '2-digit', hour12: false }
            );
          } else {
            this.timeOut = '--:--';
          }
        } else {
          this.timeIn = '--:--';
          this.timeOut = '--:--';
        }
      }
    });

    this.service.getTotalAttend().subscribe((res) => {
      this.totalDay = res.data[0].totalAttend;
    });
  }


  ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      this.id = params['id'];
      this.service.getUserData().subscribe((res) => {
        // validating their id is match with the token
        
        if (this.id !== res.data[0].user_id.toString()) {
          alert('please login properly');
          this.router.navigate(['absentia/login']);
          return;
        }

        // user can access this page with their protected data
        this.userName = res.data[0].user_name;
        this.userStatus = res.data[0].user_status;
        this.userAgency = res.data[0].user_agency_id.toUpperCase();
        this.userPicture =res.data[0].user_picture
        window.localStorage.setItem('role', res.data[0].user_role);

        
        if (window.localStorage.getItem('role') === 'admin') {
          this.router.navigate(['/absentia/admin-dashboard']);
        }
        
      });
    });
  }

  calculateOnTimePercentage() {
    const clockInParts = this.timeIn.split(':');
    const clockInHours = Number(clockInParts[0]);
    const clockInMinutes = Number(clockInParts[1]);

    const workStartParts = this.workStartTime.split(':');
    const workStartHours = Number(workStartParts[0]);
    const workStartMinutes = Number(workStartParts[1]);

    const clockInTotalMinutes = clockInHours * 60 + clockInMinutes;
    const workStartTotalMinutes = workStartHours * 60 + workStartMinutes;

    const delayMinutes = Math.max(
      clockInTotalMinutes - workStartTotalMinutes,
      0
    );

    if (clockInHours < workStartHours) {
      this.onTime = '100';
    } else if (clockInHours > workStartHours) {
      const totalMinutesInHour = 60;
      const onTimeMinutes = workStartHours * totalMinutesInHour + workStartMinutes;
      const percentage = Math.floor((onTimeMinutes / clockInTotalMinutes) * 100);
      this.onTime = percentage.toString();
    } else if (clockInHours === workStartHours){
      if (clockInMinutes > workStartMinutes) {
        this.onTime = Math.floor(
          ((workStartTotalMinutes - delayMinutes) / workStartTotalMinutes) * 100
        ).toString();
      }
    }
    this.service.timeliness(this.onTime).subscribe((res)=>{
      // do nothing
    })
  }

  getImageUrl(): SafeUrl {
    const imageUrl = `http://localhost:3000/${this.userName}/1.jpeg`;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  btnSetting() {
    // open setting dialog
  }

  goToAttendance() {
    this.router.navigate([`/absentia/${this.id}/time-management`]);
  }

  changeMenu(value: string) {
    switch(value) {
      case 'home':
        this.router.navigate([`/absentia/${this.id}`]);
        break;
      case 'attendance':
        this.router.navigate([`/absentia/${this.id}/time-management`]);
        break;
      case 'setting':
        this.router.navigate([`/absentia/${this.id}/setting`]);
        break;
    }
  }
}

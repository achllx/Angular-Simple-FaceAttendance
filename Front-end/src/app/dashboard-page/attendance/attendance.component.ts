import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';
import { LocationService } from 'src/app/service/location/location.service';

export interface attendance {
  no: number;
  date: string;
  in: string;
  out: string;
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit, AfterViewInit {
  timeIn: string = '--:--';
  timeOut: string = '--:--';
  elapsedTime: string | undefined;
  startTime: number = 0;
  maxTime: number = 540; //9 hour
  data: attendance[] = []

  displayedColumns: string[] = ['no','date', 'in', 'out'];

  dataSource = new MatTableDataSource<attendance>(this.data);
  
  //@ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // progress bar
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 100;

  private id: string = '';

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private service: ApiService,
  ) {

    this.updateElapsedTime();
    setInterval(() => this.updateElapsedTime(), 1000);
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      this.id = params['id'];
      this.service.getMonthlyAttendance().subscribe((res)=>{
        this.data = res.data;
        this.dataSource = new MatTableDataSource<attendance>(this.data);
      })
      this.service.getTodayAttendance().subscribe((res) => {

        if (res.validation){
          this.timeIn = '--:--';
          this.startTime = 0;
          this.timeOut = '--:--';
          this.mode = 'indeterminate'
        } else {
           if (this.id !== res.data[0].user_id.toString()) {
          this.router.navigate(['notfund']);
          return;
        }

        this.startTime = res.data[0].clock_in;
        this.timeIn = res.data[0].clock_in;
        this.timeOut = res.data[0].clock_out;

        if (this.timeIn !== null) {
          this.mode = 'determinate';

          this.timeIn = new Date(res.data[0].clock_in).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          if (this.timeOut !== null) {
            this.timeOut = new Date(res.data[0].clock_out).toLocaleTimeString(
              [],
              { hour: '2-digit', minute: '2-digit', hour12: false }
            );
          } else {
            this.timeOut = '--:--';
          }
          
          this.startTime = new Date(res.data[0].clock_in).getTime();
        } else {
          this.timeIn = '--:--';
          this.startTime = 0;
          this.timeOut = '--:--';
        }
        }
       
      });
      
    });
  }

  updateElapsedTime() {
    const now = new Date();
    const diffInMs = now.getTime() - this.startTime;
    const diffInSec = Math.floor(diffInMs / 1000);
    const hours = String(Math.floor(diffInSec / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((diffInSec % 3600) / 60)).padStart(2, '0');
    const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
    
    if(hours.length>2 || this.startTime===0){
      this.elapsedTime = '00:00'
    } else {
      this.elapsedTime = `${hours}:${minutes}`;
      this.value = diffInMinutes/this.maxTime * 100
    }
  }

  takeRecord(value: 'in' | 'out') {
    this.router.navigate([`/absentia/${this.id}/record-attendance/${value}`]);
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

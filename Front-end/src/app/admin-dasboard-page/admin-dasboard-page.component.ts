import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../service/api/api.service';

export interface Record {
  user_id: number,
  user_name: string,
  user_status: string,
  total_attend: number,
  average_timeliness: number,
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
//   {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
//   {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
//   {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
//   {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
//   {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
//   {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
//   {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
//   {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
//   {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
//   {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
// ];

@Component({
  selector: 'app-admin-dasboard-page',
  templateUrl: './admin-dasboard-page.component.html',
  styleUrls: ['./admin-dasboard-page.component.scss']
})
export class AdminDasboardPageComponent implements OnInit, AfterViewInit {
  agency: string = 'agency_name'
  record: Record[] = []
  displayedColumns: string[] = ['user_id', 'user_name', 'user_status', 'total_attend', 'average_timeliness'];
  userRecord = new MatTableDataSource<Record>(this.record);
  constructor(private router: Router, private service: ApiService){}
  ngOnInit(): void {
    this.service.getUserData().subscribe((res) => {
      this.agency = res.data[0].user_agency_id.toUpperCase();
      this.service.getAdmin(res.data[0].user_agency_id).subscribe((res)=>{
        this.record = res.data;
        this.userRecord = new MatTableDataSource<Record>(this.record);
      })
    })    
  }

 
  

  //@ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.userRecord.paginator = this.paginator;
  }

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('longitude');
    window.localStorage.removeItem('latitude');
    window.localStorage.removeItem('role');
    this.router.navigate(['/absentia/login'])
  }
}

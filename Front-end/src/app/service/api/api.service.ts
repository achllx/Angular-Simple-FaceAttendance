import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableLike } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000';
  
  constructor(private _http: HttpClient) { }

  regisAgency(data: any): Observable<any>{
    return this._http.post(`${this.apiUrl}/regis/agency`, data);
  }

  regisUser(data: any): Observable<any>{
    return this._http.post(`${this.apiUrl}/regis/user`, data);
  }

  checkAgency(code: string): Observable<any>{
    return this._http.get(`${this.apiUrl}/check/agency/${code}`);
  }

  loginUser(userId: string, userPassword: string, agencyId: string): Observable<any>{
    return this._http.get(`${this.apiUrl}/login/${userId}/${userPassword}/${agencyId}`);
  }

  forgotPassword(email: string, password: string): Observable<any>{
    return this._http.get(`${this.apiUrl}/change/password/${email}/${password}`);
  }

  getFace(agencyId: string): Observable<any>{
    return this._http.get(`${this.apiUrl}/agency/${agencyId}`)
  }

  getUserData(): Observable<any>{
    const token = window.localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get(`${this.apiUrl}/getUser/data`, { headers });
  }

  getAdmin(agency: string): Observable<any>{
    const token = window.localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get(`${this.apiUrl}/admin/monitor/${agency}`, { headers });
  }

  getTodayAttendance(): Observable<any>{
    const token = window.localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get(`${this.apiUrl}/user/today/attendance`, { headers })
  }

  getMonthlyAttendance(): Observable<any>{
    const token = window.localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get(`${this.apiUrl}/user/month/attendance`, { headers })
  }

  getTotalAttend(): Observable<any>{
    const token = window.localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get(`${this.apiUrl}/user/total/attend`, { headers });
  }

  timeliness(value: string): Observable<any>{
    const token = window.localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get(`${this.apiUrl}/attendance/timeliness/${value}`, { headers });
  }

  takeRecord(type: string): Observable<any>{
    const token = window.localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get(`${this.apiUrl}/attendance/${type}`, { headers });
  }
}

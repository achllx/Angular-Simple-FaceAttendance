
import { Component, OnInit } from '@angular/core';
import { Router, TitleStrategy } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface userData {
  userid: string;
  password: string;
}

export interface agencyData {
  agencyCode: string;
}

export interface forgotPassword {
  userEmail: string;
  newPassword: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser: boolean = false;
  agencyId: string = '';
  errormsg: any;
  successmsg: any;

  constructor(private dialog: MatDialog, private router: Router, private service: ApiService) {}

  ngOnInit(): void {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('latitude');
    window.localStorage.removeItem('longitude');
    window.localStorage.removeItem('role');
    this.agencyId = '';
  }

  userForm = new FormGroup({
    userid: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  agencyForm = new FormGroup({
    agencyCode: new FormControl('', Validators.required),
  });

  backButton() {
    if (!this.userForm.dirty || !this.userForm.touched) {
      this.agencyId = '';
      return this.loginUser = false;
    }

    let confirm = window.confirm(
      'You have unsaved changes. Do you want to leave this page?'
    );

    if (!confirm){
      return this.loginUser = true;
    }

    this.agencyId = '';
    this.agencyForm.reset();
    this.userForm.reset()
    this.errormsg = '';
    this.loginUser = false;
    return
  }

  userSubmit() {
    if (this.userForm.valid) {
      let uid = this.userForm.get('userid')?.value;
      this.service.loginUser(uid!, this.userForm.get('password')?.value!, this.agencyId)
      .subscribe((res) => {
        if(res.token) {
          window.localStorage.setItem('token', res.token)
          this.router.navigate([`/absentia/${uid}`]);
        } else {
          this.userForm.reset();
          this.errormsg = res;
        }
      }, error =>{
        if (error){
          this.errormsg = 'Something wrong!?';
        }
      });
    } else {
      this.errormsg = 'All Field is Required !';
    }
  }

  agencySubmit() {
    if (this.agencyForm.valid) {
      this.service.checkAgency(this.agencyForm.get('agencyCode')?.value!).subscribe((res)=>{
       if (res.error) {
        this.agencyForm.reset();
        return this.errormsg = res.message;
       }
       if (res.validation!=='true') {
        this.agencyForm.reset();
        return this.errormsg = res.message;
       }
      
       window.localStorage.setItem('latitude', res.data[0].latitude);
       window.localStorage.setItem('longitude', res.data[0].longitude);
       this.agencyId = res.data[0].agency_id
       this.agencyForm.reset();
       this.errormsg = ''
       return this.loginUser = true;
      });
    } else {
      this.errormsg = 'All Field is Required !';
      this.successmsg = '';
    }
  }

  resetMessage() {
    this.successmsg = '';
    this.errormsg = '';
  }

  isFormDirty(): boolean {
    return (
      this.userForm.dirty ||
      this.userForm.touched ||
      this.agencyForm.dirty ||
      this.agencyForm.touched
    );
  }

  openDialog(): void {
    this.dialog.open(ForgotDialog, {
      width: '312px'
    })
  }
}

@Component({
  selector: 'forgot-dialog',
  templateUrl: 'forgot-dialog.html',
})
export class ForgotDialog {
  userEmail: string = '';
  newPassword: string = '';
  msg: string = '';

  constructor(private router: Router, private service: ApiService, public dialogRef: MatDialogRef<ForgotDialog>) {}
  
  forgotForm = new FormGroup({
      userEmail: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
  })
  changePassword(): void {

    if(this.forgotForm.valid){
      const email = this.forgotForm.get('userEmail')?.value!
      const password = this.forgotForm.get('newPassword')?.value!
    
    this.service.forgotPassword(email, password).subscribe((res)=>{
      if(res.msg === 'success'){
        window.location.reload();
      }
    }, error =>{
      if(error.status === 401){
        this.msg = 'email not found';
      }
    })
    }
    
  }
}

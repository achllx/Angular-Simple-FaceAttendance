import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api/api.service';

export interface userData {
  password: string;
  agencyid: string;
  fullname: string;
  status: string;
  email: string;
  picture: any;
}

export interface agencyData {
  agencyName: string;
  agencyCode: string;
  latitude: string;
  longitude: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  regisUser: boolean = true;

  errormsg: any;
  successmsg: any;

  //@ts-ignore
  userForm: FormGroup;

  // @ts-ignore
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(
    private service: ApiService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullname: [null, Validators.required],
      password: [null, Validators.required],
      agencyid: [null, Validators.required],
      status: [null, Validators.required],
      email: [null, Validators.required],
      file: [null, Validators.required],
    });

    this.userForm.reset();
    this.agencyForm.reset();
  }

  capitalize(str: string): string {
    const words = str.split(' ');
    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i][0].toUpperCase() + words[i].substring(1).toLowerCase();
    }
    return words.join(' ');
  }

  agencyForm = new FormGroup({
    agencyName: new FormControl('', Validators.required),
    agencyCode: new FormControl('', Validators.required),
    latitude: new FormControl('', Validators.required),
    longitude: new FormControl('', Validators.required),
  });

  changeTab(tab: string) {
    this.errormsg = '';
    this.successmsg = '';

    if(!this.isFormDirty()){
      return this.regisUser = tab === 'user';
    }

    let confirm = window.confirm('You have unsaved changes. Do you want to leave this page?');

    if(confirm){
      this.userForm.reset();
      this.agencyForm.reset();
      return this.regisUser = tab === 'user';
    }

    return
  }

  userSubmit() {
    if (this.userForm.valid) {
      const formData = new FormData();

      const files = this.fileInput.nativeElement.files;

      formData.append('fullname',this.capitalize(this.userForm.get('fullname')?.value));
      formData.append('password', this.userForm.get('password')?.value);
      formData.append('agencyid', this.userForm.get('agencyid')?.value);
      formData.append('email', this.userForm.get('email')?.value);
      formData.append('status', this.capitalize(this.userForm.get('status')?.value).toLocaleLowerCase());

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      this.service.regisUser(formData).subscribe((res) => {
        this.userForm.reset();
        if (res.status !== 200) {
          this.successmsg = '';
          return (this.errormsg = res.message);
        }
        this.successmsg = res.message;
        this.errormsg = '';
      });
    } else {
      this.errormsg = 'All Field is Required !';
      this.successmsg = '';
    }
  }

  agencySubmit() {
    if (this.agencyForm.valid) {
      this.service.regisAgency(this.agencyForm.value).subscribe((res) => {
        this.agencyForm.reset();
        if (res.status !== 200) {
          this.successmsg = '';
          return (this.errormsg = res.message);
        }
        this.successmsg = res.message;
        this.errormsg = '';
      });
    } else {
      this.errormsg = 'All Field is Required !';
      this.successmsg = '';
    }
  }

  resetMessage() {
    this.successmsg = '';
  }

  isFormDirty(): boolean {
    return (
      this.userForm.dirty ||
      this.userForm.touched ||
      this.agencyForm.dirty ||
      this.agencyForm.touched
    );
  }
}

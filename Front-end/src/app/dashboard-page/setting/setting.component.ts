import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  id: string = '';
  constructor(private activeRouter: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activeRouter.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('longitude');
    window.localStorage.removeItem('latitude');
    window.localStorage.removeItem('role');
    this.router.navigate(['/absentia/login'])
  }

  changeMenu(value: string) {
    switch (value) {
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

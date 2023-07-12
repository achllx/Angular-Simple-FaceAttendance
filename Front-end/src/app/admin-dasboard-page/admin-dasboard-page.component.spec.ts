import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDasboardPageComponent } from './admin-dasboard-page.component';

describe('AdminDasboardPageComponent', () => {
  let component: AdminDasboardPageComponent;
  let fixture: ComponentFixture<AdminDasboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDasboardPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDasboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

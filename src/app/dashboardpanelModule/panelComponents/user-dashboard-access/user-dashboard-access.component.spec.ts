import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardAccessComponent } from './user-dashboard-access.component';

describe('UserDashboardAccessComponent', () => {
  let component: UserDashboardAccessComponent;
  let fixture: ComponentFixture<UserDashboardAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDashboardAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDashboardAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

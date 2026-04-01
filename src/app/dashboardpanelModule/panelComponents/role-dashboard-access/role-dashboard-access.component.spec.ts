import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDashboardAccessComponent } from './role-dashboard-access.component';

describe('RoleDashboardAccessComponent', () => {
  let component: RoleDashboardAccessComponent;
  let fixture: ComponentFixture<RoleDashboardAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleDashboardAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleDashboardAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

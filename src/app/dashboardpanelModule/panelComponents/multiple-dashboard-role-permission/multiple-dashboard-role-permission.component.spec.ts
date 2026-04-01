import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDashboardRolePermissionComponent } from './multiple-dashboard-role-permission.component';

describe('MultipleDashboardRolePermissionComponent', () => {
  let component: MultipleDashboardRolePermissionComponent;
  let fixture: ComponentFixture<MultipleDashboardRolePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleDashboardRolePermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleDashboardRolePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBasedMultiselectDashboardPermissionComponent } from './role-based-multiselect-dashboard-permission.component';

describe('RoleBasedMultiselectDashboardPermissionComponent', () => {
  let component: RoleBasedMultiselectDashboardPermissionComponent;
  let fixture: ComponentFixture<RoleBasedMultiselectDashboardPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RoleBasedMultiselectDashboardPermissionComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(RoleBasedMultiselectDashboardPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

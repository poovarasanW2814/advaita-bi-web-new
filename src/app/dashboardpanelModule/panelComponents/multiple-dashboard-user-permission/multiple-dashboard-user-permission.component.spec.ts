import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDashboardUserPermissionComponent } from './multiple-dashboard-user-permission.component';

describe('MultipleDashboardUserPermissionComponent', () => {
  let component: MultipleDashboardUserPermissionComponent;
  let fixture: ComponentFixture<MultipleDashboardUserPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleDashboardUserPermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleDashboardUserPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

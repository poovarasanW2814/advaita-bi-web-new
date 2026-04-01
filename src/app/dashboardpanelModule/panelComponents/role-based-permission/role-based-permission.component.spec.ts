import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBasedPermissionComponent } from './role-based-permission.component';

describe('RoleBasedPermissionComponent', () => {
  let component: RoleBasedPermissionComponent;
  let fixture: ComponentFixture<RoleBasedPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleBasedPermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleBasedPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

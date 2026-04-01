import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBasedPermissionComponent } from './user-based-permission.component';

describe('UserBasedPermissionComponent', () => {
  let component: UserBasedPermissionComponent;
  let fixture: ComponentFixture<UserBasedPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBasedPermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBasedPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavbarComponent } from './sidebar-navbar.component';

describe('SidebarNavbarComponent', () => {
  let component: SidebarNavbarComponent;
  let fixture: ComponentFixture<SidebarNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

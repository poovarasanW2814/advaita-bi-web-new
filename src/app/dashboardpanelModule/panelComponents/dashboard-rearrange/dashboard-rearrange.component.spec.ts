import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRearrangeComponent } from './dashboard-rearrange.component';

describe('DashboardRearrangeComponent', () => {
  let component: DashboardRearrangeComponent;
  let fixture: ComponentFixture<DashboardRearrangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardRearrangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRearrangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

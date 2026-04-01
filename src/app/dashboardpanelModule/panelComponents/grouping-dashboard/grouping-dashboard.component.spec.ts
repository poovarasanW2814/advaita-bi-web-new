import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupingDashboardComponent } from './grouping-dashboard.component';

describe('GroupingDashboardComponent', () => {
  let component: GroupingDashboardComponent;
  let fixture: ComponentFixture<GroupingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupingDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

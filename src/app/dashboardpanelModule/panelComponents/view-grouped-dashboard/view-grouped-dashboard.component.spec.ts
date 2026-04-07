import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupedDashboardComponent } from './view-grouped-dashboard.component';

describe('ViewGroupedDashboardComponent', () => {
  let component: ViewGroupedDashboardComponent;
  let fixture: ComponentFixture<ViewGroupedDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ViewGroupedDashboardComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ViewGroupedDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

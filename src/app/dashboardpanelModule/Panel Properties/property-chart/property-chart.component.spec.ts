import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyChartComponent } from './property-chart.component';

describe('PropertyChartComponent', () => {
  let component: PropertyChartComponent;
  let fixture: ComponentFixture<PropertyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuageChartPropertiesComponent } from './guage-chart-properties.component';

describe('GuageChartPropertiesComponent', () => {
  let component: GuageChartPropertiesComponent;
  let fixture: ComponentFixture<GuageChartPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuageChartPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuageChartPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

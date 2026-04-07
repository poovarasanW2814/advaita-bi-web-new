import { ComponentFixture, TestBed } from '@angular/core/testing';

import { guageChartPropertiesComponent } from './guage-chart-properties.component';

describe('guageChartPropertiesComponent', () => {
  let component: guageChartPropertiesComponent;
  let fixture: ComponentFixture<guageChartPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [guageChartPropertiesComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(guageChartPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

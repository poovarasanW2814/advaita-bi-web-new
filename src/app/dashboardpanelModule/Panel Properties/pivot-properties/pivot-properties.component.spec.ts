import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PivotPropertiesComponent } from './pivot-properties.component';

describe('PivotPropertiesComponent', () => {
  let component: PivotPropertiesComponent;
  let fixture: ComponentFixture<PivotPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PivotPropertiesComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PivotPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

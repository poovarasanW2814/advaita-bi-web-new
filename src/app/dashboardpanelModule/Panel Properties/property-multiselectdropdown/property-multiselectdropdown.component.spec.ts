import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMultiselectdropdownComponent } from './property-multiselectdropdown.component';

describe('PropertyMultiselectdropdownComponent', () => {
  let component: PropertyMultiselectdropdownComponent;
  let fixture: ComponentFixture<PropertyMultiselectdropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyMultiselectdropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyMultiselectdropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

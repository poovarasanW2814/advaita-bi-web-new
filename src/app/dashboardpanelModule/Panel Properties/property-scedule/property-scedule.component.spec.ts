import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySceduleComponent } from './property-scedule.component';

describe('PropertySceduleComponent', () => {
  let component: PropertySceduleComponent;
  let fixture: ComponentFixture<PropertySceduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertySceduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertySceduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

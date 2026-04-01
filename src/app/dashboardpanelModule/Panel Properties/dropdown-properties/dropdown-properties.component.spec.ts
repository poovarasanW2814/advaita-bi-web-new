import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownPropertiesComponent } from './dropdown-properties.component';

describe('DropdownPropertiesComponent', () => {
  let component: DropdownPropertiesComponent;
  let fixture: ComponentFixture<DropdownPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

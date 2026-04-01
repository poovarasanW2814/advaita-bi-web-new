import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBoxPropertiesComponent } from './input-box-properties.component';

describe('InputBoxPropertiesComponent', () => {
  let component: InputBoxPropertiesComponent;
  let fixture: ComponentFixture<InputBoxPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputBoxPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputBoxPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialFiltersComponent } from './initial-filters.component';

describe('InitialFiltersComponent', () => {
  let component: InitialFiltersComponent;
  let fixture: ComponentFixture<InitialFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

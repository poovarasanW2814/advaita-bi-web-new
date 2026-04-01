import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordHomepageComponent } from './dashbord-homepage.component';

describe('DashbordHomepageComponent', () => {
  let component: DashbordHomepageComponent;
  let fixture: ComponentFixture<DashbordHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashbordHomepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

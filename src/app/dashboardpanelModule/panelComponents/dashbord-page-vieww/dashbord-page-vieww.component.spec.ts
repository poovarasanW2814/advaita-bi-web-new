import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordPageViewwComponent } from './dashbord-page-vieww.component';

describe('DashbordPageViewwComponent', () => {
  let component: DashbordPageViewwComponent;
  let fixture: ComponentFixture<DashbordPageViewwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DashbordPageViewwComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DashbordPageViewwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

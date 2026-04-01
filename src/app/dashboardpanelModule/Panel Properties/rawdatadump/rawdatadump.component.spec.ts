import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawdatadumpComponent } from './rawdatadump.component';

describe('RawdatadumpComponent', () => {
  let component: RawdatadumpComponent;
  let fixture: ComponentFixture<RawdatadumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawdatadumpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawdatadumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

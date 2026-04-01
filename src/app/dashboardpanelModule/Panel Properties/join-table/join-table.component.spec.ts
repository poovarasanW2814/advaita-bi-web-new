import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTableComponent } from './join-table.component';

describe('JoinTableComponent', () => {
  let component: JoinTableComponent;
  let fixture: ComponentFixture<JoinTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

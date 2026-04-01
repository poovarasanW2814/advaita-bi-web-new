import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionDatabaseComponent } from './connection-database.component';

describe('ConnectionDatabaseComponent', () => {
  let component: ConnectionDatabaseComponent;
  let fixture: ComponentFixture<ConnectionDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionDatabaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

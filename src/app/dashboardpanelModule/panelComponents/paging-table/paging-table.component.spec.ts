import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagingTableComponent } from './paging-table.component';

describe('PagingTableComponent', () => {
  let component: PagingTableComponent;
  let fixture: ComponentFixture<PagingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PagingTableComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(PagingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

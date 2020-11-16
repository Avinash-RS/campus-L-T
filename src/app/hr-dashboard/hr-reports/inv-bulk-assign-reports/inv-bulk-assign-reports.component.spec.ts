import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvBulkAssignReportsComponent } from './inv-bulk-assign-reports.component';

describe('InvBulkAssignReportsComponent', () => {
  let component: InvBulkAssignReportsComponent;
  let fixture: ComponentFixture<InvBulkAssignReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvBulkAssignReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvBulkAssignReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

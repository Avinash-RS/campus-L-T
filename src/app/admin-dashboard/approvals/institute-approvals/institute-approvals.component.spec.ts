import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteApprovalsComponent } from './institute-approvals.component';

describe('InstituteApprovalsComponent', () => {
  let component: InstituteApprovalsComponent;
  let fixture: ComponentFixture<InstituteApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituteApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUploadedInstituteListComponent } from './admin-uploaded-institute-list.component';

describe('AdminUploadedInstituteListComponent', () => {
  let component: AdminUploadedInstituteListComponent;
  let fixture: ComponentFixture<AdminUploadedInstituteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUploadedInstituteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUploadedInstituteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

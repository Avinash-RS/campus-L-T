import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUploadedCandidateListComponent } from './admin-uploaded-candidate-list.component';

describe('AdminUploadedCandidateListComponent', () => {
  let component: AdminUploadedCandidateListComponent;
  let fixture: ComponentFixture<AdminUploadedCandidateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUploadedCandidateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUploadedCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

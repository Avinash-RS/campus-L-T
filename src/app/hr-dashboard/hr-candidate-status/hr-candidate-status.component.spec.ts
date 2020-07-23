import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrCandidateStatusComponent } from './hr-candidate-status.component';

describe('HrCandidateStatusComponent', () => {
  let component: HrCandidateStatusComponent;
  let fixture: ComponentFixture<HrCandidateStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrCandidateStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrCandidateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

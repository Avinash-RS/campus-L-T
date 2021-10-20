import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondLevelShortlistedCandidatesReportComponent } from './second-level-shortlisted-candidates-report.component';

describe('SecondLevelShortlistedCandidatesReportComponent', () => {
  let component: SecondLevelShortlistedCandidatesReportComponent;
  let fixture: ComponentFixture<SecondLevelShortlistedCandidatesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondLevelShortlistedCandidatesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondLevelShortlistedCandidatesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

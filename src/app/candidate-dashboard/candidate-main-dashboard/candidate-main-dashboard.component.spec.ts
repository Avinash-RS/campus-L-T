import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateMainDashboardComponent } from './candidate-main-dashboard.component';

describe('CandidateMainDashboardComponent', () => {
  let component: CandidateMainDashboardComponent;
  let fixture: ComponentFixture<CandidateMainDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateMainDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateMainDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

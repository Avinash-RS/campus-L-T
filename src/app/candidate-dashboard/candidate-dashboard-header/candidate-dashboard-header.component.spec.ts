import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDashboardHeaderComponent } from './candidate-dashboard-header.component';

describe('CandidateDashboardHeaderComponent', () => {
  let component: CandidateDashboardHeaderComponent;
  let fixture: ComponentFixture<CandidateDashboardHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateDashboardHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDashboardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

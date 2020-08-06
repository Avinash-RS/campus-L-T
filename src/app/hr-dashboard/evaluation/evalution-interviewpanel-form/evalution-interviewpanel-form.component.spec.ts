import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalutionInterviewpanelFormComponent } from './evalution-interviewpanel-form.component';

describe('EvalutionInterviewpanelFormComponent', () => {
  let component: EvalutionInterviewpanelFormComponent;
  let fixture: ComponentFixture<EvalutionInterviewpanelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvalutionInterviewpanelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalutionInterviewpanelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

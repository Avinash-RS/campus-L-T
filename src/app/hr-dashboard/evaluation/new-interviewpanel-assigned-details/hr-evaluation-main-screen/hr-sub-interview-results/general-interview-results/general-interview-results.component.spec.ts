import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInterviewResultsComponent } from './general-interview-results.component';

describe('GeneralInterviewResultsComponent', () => {
  let component: GeneralInterviewResultsComponent;
  let fixture: ComponentFixture<GeneralInterviewResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralInterviewResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInterviewResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaniInterviewResultsComponent } from './adani-interview-results.component';

describe('AdaniInterviewResultsComponent', () => {
  let component: AdaniInterviewResultsComponent;
  let fixture: ComponentFixture<AdaniInterviewResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaniInterviewResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaniInterviewResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

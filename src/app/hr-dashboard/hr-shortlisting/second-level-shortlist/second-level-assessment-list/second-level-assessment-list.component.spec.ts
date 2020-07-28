import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondLevelAssessmentListComponent } from './second-level-assessment-list.component';

describe('SecondLevelAssessmentListComponent', () => {
  let component: SecondLevelAssessmentListComponent;
  let fixture: ComponentFixture<SecondLevelAssessmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondLevelAssessmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondLevelAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

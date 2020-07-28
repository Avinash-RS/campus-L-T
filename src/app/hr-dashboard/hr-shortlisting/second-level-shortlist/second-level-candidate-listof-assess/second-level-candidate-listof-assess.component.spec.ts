import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondLevelCandidateListofAssessComponent } from './second-level-candidate-listof-assess.component';

describe('SecondLevelCandidateListofAssessComponent', () => {
  let component: SecondLevelCandidateListofAssessComponent;
  let fixture: ComponentFixture<SecondLevelCandidateListofAssessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondLevelCandidateListofAssessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondLevelCandidateListofAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSharedEvaluationHeaderComponent } from './sub-shared-evaluation-header.component';

describe('SubSharedEvaluationHeaderComponent', () => {
  let component: SubSharedEvaluationHeaderComponent;
  let fixture: ComponentFixture<SubSharedEvaluationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSharedEvaluationHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSharedEvaluationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

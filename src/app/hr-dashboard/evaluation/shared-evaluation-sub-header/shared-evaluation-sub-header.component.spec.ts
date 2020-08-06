import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedEvaluationSubHeaderComponent } from './shared-evaluation-sub-header.component';

describe('SharedEvaluationSubHeaderComponent', () => {
  let component: SharedEvaluationSubHeaderComponent;
  let fixture: ComponentFixture<SharedEvaluationSubHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedEvaluationSubHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedEvaluationSubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

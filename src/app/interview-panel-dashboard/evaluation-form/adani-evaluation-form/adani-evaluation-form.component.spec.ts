import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaniEvaluationFormComponent } from './adani-evaluation-form.component';

describe('AdaniEvaluationFormComponent', () => {
  let component: AdaniEvaluationFormComponent;
  let fixture: ComponentFixture<AdaniEvaluationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaniEvaluationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaniEvaluationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

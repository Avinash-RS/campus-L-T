import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaEvaluationFormComponent } from './ca-evaluation-form.component';

describe('CaEvaluationFormComponent', () => {
  let component: CaEvaluationFormComponent;
  let fixture: ComponentFixture<CaEvaluationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaEvaluationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaEvaluationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

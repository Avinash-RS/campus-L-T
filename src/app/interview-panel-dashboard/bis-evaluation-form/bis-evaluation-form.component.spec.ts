import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BisEvaluationFormComponent } from './bis-evaluation-form.component';

describe('BisEvaluationFormComponent', () => {
  let component: BisEvaluationFormComponent;
  let fixture: ComponentFixture<BisEvaluationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BisEvaluationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BisEvaluationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

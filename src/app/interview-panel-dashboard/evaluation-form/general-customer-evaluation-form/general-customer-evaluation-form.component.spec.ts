import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCustomerEvaluationFormComponent } from './general-customer-evaluation-form.component';

describe('GeneralCustomerEvaluationFormComponent', () => {
  let component: GeneralCustomerEvaluationFormComponent;
  let fixture: ComponentFixture<GeneralCustomerEvaluationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralCustomerEvaluationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralCustomerEvaluationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

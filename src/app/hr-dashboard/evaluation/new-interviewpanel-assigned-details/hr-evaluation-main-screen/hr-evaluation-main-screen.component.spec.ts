import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrEvaluationMainScreenComponent } from './hr-evaluation-main-screen.component';

describe('HrEvaluationMainScreenComponent', () => {
  let component: HrEvaluationMainScreenComponent;
  let fixture: ComponentFixture<HrEvaluationMainScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrEvaluationMainScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrEvaluationMainScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

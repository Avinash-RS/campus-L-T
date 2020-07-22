import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvEvaluationMainScreenComponent } from './inv-evaluation-main-screen.component';

describe('InvEvaluationMainScreenComponent', () => {
  let component: InvEvaluationMainScreenComponent;
  let fixture: ComponentFixture<InvEvaluationMainScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvEvaluationMainScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvEvaluationMainScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

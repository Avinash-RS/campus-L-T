import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvSubEvaluateComponent } from './inv-sub-evaluate.component';

describe('InvSubEvaluateComponent', () => {
  let component: InvSubEvaluateComponent;
  let fixture: ComponentFixture<InvSubEvaluateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvSubEvaluateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvSubEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

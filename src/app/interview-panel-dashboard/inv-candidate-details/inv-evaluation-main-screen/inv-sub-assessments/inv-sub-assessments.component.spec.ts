import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvSubAssessmentsComponent } from './inv-sub-assessments.component';

describe('InvSubAssessmentsComponent', () => {
  let component: InvSubAssessmentsComponent;
  let fixture: ComponentFixture<InvSubAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvSubAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvSubAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

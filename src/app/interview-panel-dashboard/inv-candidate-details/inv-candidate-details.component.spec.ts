import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvCandidateDetailsComponent } from './inv-candidate-details.component';

describe('InvCandidateDetailsComponent', () => {
  let component: InvCandidateDetailsComponent;
  let fixture: ComponentFixture<InvCandidateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvCandidateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvCandidateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

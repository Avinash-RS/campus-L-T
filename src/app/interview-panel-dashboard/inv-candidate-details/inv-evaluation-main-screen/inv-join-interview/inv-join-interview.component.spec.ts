import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvJoinInterviewComponent } from './inv-join-interview.component';

describe('InvJoinInterviewComponent', () => {
  let component: InvJoinInterviewComponent;
  let fixture: ComponentFixture<InvJoinInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvJoinInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvJoinInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateHallticketComponent } from './candidate-hallticket.component';

describe('CandidateHallticketComponent', () => {
  let component: CandidateHallticketComponent;
  let fixture: ComponentFixture<CandidateHallticketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateHallticketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateHallticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

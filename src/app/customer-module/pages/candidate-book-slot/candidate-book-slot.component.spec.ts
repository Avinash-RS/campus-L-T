import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateBookSlotComponent } from './candidate-book-slot.component';

describe('CandidateBookSlotComponent', () => {
  let component: CandidateBookSlotComponent;
  let fixture: ComponentFixture<CandidateBookSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateBookSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateBookSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateFaqComponent } from './candidate-faq.component';

describe('CandidateFaqComponent', () => {
  let component: CandidateFaqComponent;
  let fixture: ComponentFixture<CandidateFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

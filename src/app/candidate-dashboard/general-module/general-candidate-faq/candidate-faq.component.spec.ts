import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCandidateFaqComponent } from './candidate-faq.component';

describe('CandidateFaqComponent', () => {
  let component: GeneralCandidateFaqComponent;
  let fixture: ComponentFixture<GeneralCandidateFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralCandidateFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralCandidateFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

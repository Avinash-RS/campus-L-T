import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateLandingPageComponent } from './candidate-landing-page.component';

describe('CandidateLandingPageComponent', () => {
  let component: CandidateLandingPageComponent;
  let fixture: ComponentFixture<CandidateLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

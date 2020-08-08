import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvShortlistedCandidatesViewScreenComponent } from './inv-shortlisted-candidates-view-screen.component';

describe('InvShortlistedCandidatesViewScreenComponent', () => {
  let component: InvShortlistedCandidatesViewScreenComponent;
  let fixture: ComponentFixture<InvShortlistedCandidatesViewScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvShortlistedCandidatesViewScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvShortlistedCandidatesViewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

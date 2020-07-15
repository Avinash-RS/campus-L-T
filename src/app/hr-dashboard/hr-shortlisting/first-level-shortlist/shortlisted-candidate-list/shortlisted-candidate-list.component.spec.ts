import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistedCandidateListComponent } from './shortlisted-candidate-list.component';

describe('ShortlistedCandidateListComponent', () => {
  let component: ShortlistedCandidateListComponent;
  let fixture: ComponentFixture<ShortlistedCandidateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortlistedCandidateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortlistedCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

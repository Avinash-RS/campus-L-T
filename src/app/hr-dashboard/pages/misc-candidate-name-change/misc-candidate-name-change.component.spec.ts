import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscCandidateNameChangeComponent } from './misc-candidate-name-change.component';

describe('MiscCandidateNameChangeComponent', () => {
  let component: MiscCandidateNameChangeComponent;
  let fixture: ComponentFixture<MiscCandidateNameChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiscCandidateNameChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscCandidateNameChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoAddCandidateComponent } from './tpo-add-candidate.component';

describe('TpoAddCandidateComponent', () => {
  let component: TpoAddCandidateComponent;
  let fixture: ComponentFixture<TpoAddCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpoAddCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpoAddCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

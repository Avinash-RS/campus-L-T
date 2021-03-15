import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofSelectedCandidatesComponent } from './listof-selected-candidates.component';

describe('ListofSelectedCandidatesComponent', () => {
  let component: ListofSelectedCandidatesComponent;
  let fixture: ComponentFixture<ListofSelectedCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListofSelectedCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListofSelectedCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

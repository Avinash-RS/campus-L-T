import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedCandidatesListComponent } from './offered-candidates-list.component';

describe('OfferedCandidatesListComponent', () => {
  let component: OfferedCandidatesListComponent;
  let fixture: ComponentFixture<OfferedCandidatesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferedCandidatesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedCandidatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

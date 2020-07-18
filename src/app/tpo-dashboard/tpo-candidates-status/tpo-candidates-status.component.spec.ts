import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpoCandidatesStatusComponent } from './tpo-candidates-status.component';

describe('TpoCandidatesStatusComponent', () => {
  let component: TpoCandidatesStatusComponent;
  let fixture: ComponentFixture<TpoCandidatesStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpoCandidatesStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpoCandidatesStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

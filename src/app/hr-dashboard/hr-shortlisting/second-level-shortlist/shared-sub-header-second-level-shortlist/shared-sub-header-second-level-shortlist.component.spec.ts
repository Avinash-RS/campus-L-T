import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSubHeaderSecondLevelShortlistComponent } from './shared-sub-header-second-level-shortlist.component';

describe('SharedSubHeaderSecondLevelShortlistComponent', () => {
  let component: SharedSubHeaderSecondLevelShortlistComponent;
  let fixture: ComponentFixture<SharedSubHeaderSecondLevelShortlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedSubHeaderSecondLevelShortlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSubHeaderSecondLevelShortlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

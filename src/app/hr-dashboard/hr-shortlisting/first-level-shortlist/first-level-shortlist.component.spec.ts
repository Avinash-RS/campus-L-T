import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLevelShortlistComponent } from './first-level-shortlist.component';

describe('FirstLevelShortlistComponent', () => {
  let component: FirstLevelShortlistComponent;
  let fixture: ComponentFixture<FirstLevelShortlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstLevelShortlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstLevelShortlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

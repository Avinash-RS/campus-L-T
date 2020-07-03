import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLevelShorlistReportsComponent } from './first-level-shorlist-reports.component';

describe('FirstLevelShorlistReportsComponent', () => {
  let component: FirstLevelShorlistReportsComponent;
  let fixture: ComponentFixture<FirstLevelShorlistReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstLevelShorlistReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstLevelShorlistReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

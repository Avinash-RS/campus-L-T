import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrShortlistingComponent } from './hr-shortlisting.component';

describe('HrShortlistingComponent', () => {
  let component: HrShortlistingComponent;
  let fixture: ComponentFixture<HrShortlistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrShortlistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrShortlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

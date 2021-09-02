import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedReportsSectionComponent } from './shared-reports-section.component';

describe('SharedReportsSectionComponent', () => {
  let component: SharedReportsSectionComponent;
  let fixture: ComponentFixture<SharedReportsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedReportsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedReportsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

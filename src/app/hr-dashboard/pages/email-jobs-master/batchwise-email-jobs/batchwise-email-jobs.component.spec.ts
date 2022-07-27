import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchwiseEmailJobsComponent } from './batchwise-email-jobs.component';

describe('BatchwiseEmailJobsComponent', () => {
  let component: BatchwiseEmailJobsComponent;
  let fixture: ComponentFixture<BatchwiseEmailJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchwiseEmailJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchwiseEmailJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailJobsComponent } from './email-jobs.component';

describe('EmailJobsComponent', () => {
  let component: EmailJobsComponent;
  let fixture: ComponentFixture<EmailJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

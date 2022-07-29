import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTriggerPreviewComponent } from './email-trigger-preview.component';

describe('EmailTriggerPreviewComponent', () => {
  let component: EmailTriggerPreviewComponent;
  let fixture: ComponentFixture<EmailTriggerPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTriggerPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTriggerPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

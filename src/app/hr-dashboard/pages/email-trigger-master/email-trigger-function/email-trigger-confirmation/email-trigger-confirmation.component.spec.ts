import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTriggerConfirmationComponent } from './email-trigger-confirmation.component';

describe('EmailTriggerConfirmationComponent', () => {
  let component: EmailTriggerConfirmationComponent;
  let fixture: ComponentFixture<EmailTriggerConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTriggerConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTriggerConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

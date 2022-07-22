import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTriggerFunctionComponent } from './email-trigger-function.component';

describe('EmailTriggerFunctionComponent', () => {
  let component: EmailTriggerFunctionComponent;
  let fixture: ComponentFixture<EmailTriggerFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTriggerFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTriggerFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

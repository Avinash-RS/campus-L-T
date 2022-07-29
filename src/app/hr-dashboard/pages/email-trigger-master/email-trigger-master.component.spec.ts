import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTriggerMasterComponent } from './email-trigger-master.component';

describe('EmailTriggerMasterComponent', () => {
  let component: EmailTriggerMasterComponent;
  let fixture: ComponentFixture<EmailTriggerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTriggerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTriggerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailJobsMasterComponent } from './email-jobs-master.component';

describe('EmailJobsMasterComponent', () => {
  let component: EmailJobsMasterComponent;
  let fixture: ComponentFixture<EmailJobsMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailJobsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailJobsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

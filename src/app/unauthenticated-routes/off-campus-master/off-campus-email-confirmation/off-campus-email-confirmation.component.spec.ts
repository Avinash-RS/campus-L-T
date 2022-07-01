import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffCampusEmailConfirmationComponent } from './off-campus-email-confirmation.component';

describe('OffCampusEmailConfirmationComponent', () => {
  let component: OffCampusEmailConfirmationComponent;
  let fixture: ComponentFixture<OffCampusEmailConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffCampusEmailConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffCampusEmailConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffCampusSubmittedConfirmationComponent } from './off-campus-submitted-confirmation.component';

describe('OffCampusSubmittedConfirmationComponent', () => {
  let component: OffCampusSubmittedConfirmationComponent;
  let fixture: ComponentFixture<OffCampusSubmittedConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffCampusSubmittedConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffCampusSubmittedConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

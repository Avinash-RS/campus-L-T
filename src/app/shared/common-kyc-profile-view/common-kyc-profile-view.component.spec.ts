import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonKycProfileViewComponent } from './common-kyc-profile-view.component';

describe('CommonKycProfileViewComponent', () => {
  let component: CommonKycProfileViewComponent;
  let fixture: ComponentFixture<CommonKycProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonKycProfileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonKycProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

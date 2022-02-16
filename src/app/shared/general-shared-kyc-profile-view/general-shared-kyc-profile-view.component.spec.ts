import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSharedKycProfileViewComponent } from './general-shared-kyc-profile-view.component';

describe('GeneralSharedKycProfileViewComponent', () => {
  let component: GeneralSharedKycProfileViewComponent;
  let fixture: ComponentFixture<GeneralSharedKycProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralSharedKycProfileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralSharedKycProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
